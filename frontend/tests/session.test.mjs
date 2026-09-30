import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  IDLE_TIMEOUT_MS, startSession, endSession, getSessionToken,
  getLogoutMessage, monitorSession, validateSession,
} from '../src/services/session.ts';

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function events() {
  const listeners = new Map();
  return {
    addEventListener(name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
    },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    dispatchEvent(event) { listeners.get(event.type)?.forEach((fn) => fn(event)); },
  };
}

function setup(t) {
  let now = 1_800_000_000_000;
  const timers = new Map();
  let id = 0;
  t.mock.method(Date, 'now', () => now);
  t.mock.method(globalThis, 'setTimeout', (fn, delay) => {
    timers.set(++id, { fn, at: now + delay });
    return id;
  });
  t.mock.method(globalThis, 'clearTimeout', (key) => timers.delete(key));
  for (const [key, value] of Object.entries({
    localStorage: storage(), sessionStorage: storage(), window: events(),
    document: { ...events(), visibilityState: 'visible' },
  })) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => descriptor ? Object.defineProperty(globalThis, key, descriptor) : delete globalThis[key]);
  }
  return {
    token: (lifetime = 86_400_000) => `header.${Buffer.from(JSON.stringify({ exp: (now + lifetime) / 1000 })).toString('base64url')}.signature`,
    advance(ms, runTimers = true) {
      now += ms;
      if (runTimers) {
        for (const [key, timer] of [...timers]) {
          if (timer.at <= now) { timers.delete(key); timer.fn(); }
        }
      }
    },
    activity: () => window.dispatchEvent({ type: 'keydown', isTrusted: true }),
    timers,
  };
}

test('idle deadline logs out, clears credentials and explains why', (t) => {
  const env = setup(t);
  startSession(env.token());
  const stop = monitorSession();
  env.advance(IDLE_TIMEOUT_MS - 1);
  assert.ok(getSessionToken());
  env.advance(1);
  assert.equal(getSessionToken(), null);
  assert.equal(localStorage.getItem('auth_token'), null);
  assert.match(getLogoutMessage(), /60 minutes/);
  stop();
  assert.equal(env.timers.size, 0);
});

test('real activity extends idle deadline but never the token expiry', (t) => {
  const env = setup(t);
  startSession(env.token(90 * 60_000));
  const stop = monitorSession();
  env.advance(50 * 60_000);
  env.activity();
  env.advance(20 * 60_000);
  assert.ok(getSessionToken());
  env.advance(20 * 60_000);
  assert.equal(getSessionToken(), null);
  assert.match(getLogoutMessage(), /expired/);
  stop();
});

test('activity after sleep cannot revive an expired idle session', (t) => {
  const env = setup(t);
  startSession(env.token());
  const stop = monitorSession();
  env.advance(IDLE_TIMEOUT_MS + 1, false);
  env.activity();
  assert.equal(getSessionToken(), null);
  assert.match(getLogoutMessage(), /inactivity/);
  stop();
});

test('reload preserves idle deadline and other-tab activity updates it', (t) => {
  const env = setup(t);
  startSession(env.token());
  env.advance(40 * 60_000);
  const stop = monitorSession();
  env.advance(10 * 60_000);
  localStorage.setItem('auth_last_activity', Date.now());
  window.dispatchEvent({ type: 'storage' });
  env.advance(20 * 60_000);
  assert.ok(getSessionToken());
  env.advance(40 * 60_000);
  assert.equal(getSessionToken(), null);
  stop();
});

test('invalid tokens and old sessions fail closed; new login resets idle state', (t) => {
  const env = setup(t);
  startSession('invalid');
  assert.equal(validateSession(), null);
  startSession(env.token());
  assert.equal(getLogoutMessage(), null);
  assert.ok(getSessionToken());
  localStorage.removeItem('auth_last_activity');
  assert.equal(validateSession(), null);
  startSession(env.token());
  endSession();
  assert.equal(getSessionToken(), null);
  assert.equal(getLogoutMessage(), null);
});

test('synthetic events and hidden-tab activity do not keep a session alive', (t) => {
  const env = setup(t);
  startSession(env.token());
  const stop = monitorSession();
  env.advance(50 * 60_000);
  window.dispatchEvent({ type: 'pointermove', isTrusted: false });
  document.visibilityState = 'hidden';
  env.activity();
  env.advance(10 * 60_000);
  assert.equal(getSessionToken(), null);
  stop();
});

test('logout from another tab clears the pending timer', (t) => {
  const env = setup(t);
  startSession(env.token());
  const stop = monitorSession();
  localStorage.removeItem('auth_token');
  window.dispatchEvent({ type: 'storage' });
  assert.equal(getSessionToken(), null);
  assert.equal(env.timers.size, 0);
  stop();
});

export const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const TOKEN_KEY = "auth_token";
const ACTIVITY_KEY = "auth_last_activity";
const SESSION_EVENT = "auth-session-change";
const REASON_KEY = "auth_logout_reason";

type LogoutReason = "idle" | "expired" | "manual";

function tokenExpiry(token: string): number {
  try {
    const encoded = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(encoded));
    return typeof payload.exp === "number" && Number.isFinite(payload.exp)
      ? payload.exp * 1000
      : 0;
  } catch {
    return 0;
  }
}

function invalidReason(token: string): LogoutReason | null {
  const now = Date.now();
  if (now >= tokenExpiry(token)) return "expired";
  const lastActivity = Number(localStorage.getItem(ACTIVITY_KEY));
  if (!lastActivity || !Number.isFinite(lastActivity) || lastActivity > now ||
      now - lastActivity >= IDLE_TIMEOUT_MS) return "idle";
  return null;
}

export function getSessionToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  return token && !invalidReason(token) ? token : null;
}

export function validateSession(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const reason = invalidReason(token);
  if (reason) {
    endSession(reason);
    return null;
  }
  return token;
}

export function startSession(token: string): void {
  sessionStorage.removeItem(REASON_KEY);
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function endSession(reason: LogoutReason = "manual"): void {
  if (reason === "manual") sessionStorage.removeItem(REASON_KEY);
  else sessionStorage.setItem(REASON_KEY, reason);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACTIVITY_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getLogoutMessage(): string | null {
  const reason = sessionStorage.getItem(REASON_KEY);
  if (reason === "idle") return "You were logged out after 60 minutes of inactivity. Please sign in again.";
  if (reason === "expired") return "Your session has expired. Please sign in again.";
  return null;
}

export function subscribeToSession(listener: () => void): () => void {
  window.addEventListener(SESSION_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(SESSION_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

// Use absolute timestamps so background tabs and sleeping devices cannot extend a session.
export function monitorSession(): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const check = () => {
    clearTimeout(timer);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const reason = invalidReason(token);
    if (reason) {
      endSession(reason);
      return;
    }
    const idleDeadline = Number(localStorage.getItem(ACTIVITY_KEY)) + IDLE_TIMEOUT_MS;
    timer = setTimeout(check, Math.min(idleDeadline, tokenExpiry(token)) - Date.now());
  };

  const onActivity = (event: Event) => {
    if (!event.isTrusted || document.visibilityState === "hidden") return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    // Check before updating: activity after the deadline must not revive a session.
    const reason = invalidReason(token);
    if (reason) {
      endSession(reason);
      return;
    }
    if (Date.now() - Number(localStorage.getItem(ACTIVITY_KEY)) < 1000) return;
    localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
    check();
  };

  const activityEvents = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "touchmove", "scroll"];
  activityEvents.forEach((name) => window.addEventListener(name, onActivity, { passive: true, capture: true }));
  window.addEventListener("focus", check);
  window.addEventListener("pageshow", check);
  document.addEventListener("visibilitychange", check);
  const unsubscribe = subscribeToSession(check);
  check();

  return () => {
    clearTimeout(timer);
    unsubscribe();
    activityEvents.forEach((name) => window.removeEventListener(name, onActivity, true));
    window.removeEventListener("focus", check);
    window.removeEventListener("pageshow", check);
    document.removeEventListener("visibilitychange", check);
  };
}

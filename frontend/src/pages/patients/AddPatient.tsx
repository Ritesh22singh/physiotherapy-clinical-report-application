import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { createPatient } from "../../services/patientService";

const AddPatient = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await createPatient({
        name: name.trim(),
        ...(phone.trim() && { phone: phone.trim() }),
        ...(dateOfBirth && { dateOfBirth }),
      });

      navigate("/patients");
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      setError(message || "Could not save patient");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-xl space-y-6">
        <Link to="/patients" className="text-sm text-slate-600">
          Back to patients
        </Link>

        <h1 className="text-3xl font-semibold">Add patient</h1>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="name" className="mb-2 block font-medium">Name *</label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block font-medium">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="mb-2 block font-medium">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          {error && <p role="alert" className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save patient"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddPatient;
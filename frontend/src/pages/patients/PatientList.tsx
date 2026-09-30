import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../../services/patientService";
import type { Patient } from "../../types/patient.types";

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch(() => setError("Could not load patients"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link to="/dashboard" className="text-sm text-slate-600">
          ← Back to dashboard
        </Link>

        <h1 className="text-3xl font-semibold text-slate-900">Patients</h1>

        <Link
          to="/patients/new"
          className="inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Add patient
        </Link>

        {loading && <p>Loading patients...</p>}
        {error && <p role="alert" className="text-red-600">{error}</p>}
        {!loading && !error && patients.length === 0 && (
          <p>No patients yet.</p>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2">
            {patients.map((patient) => (
              <article
                key={patient._id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold">
                  <Link to={`/patients/${patient._id}`} className="hover:underline">
                    {patient.name}
                  </Link>
                </h2>
                {patient.phone && (
                  <p className="mt-2 text-sm text-slate-600">{patient.phone}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default PatientList;

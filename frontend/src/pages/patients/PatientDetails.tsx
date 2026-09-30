import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPatient } from "../../services/patientService";
import type { Patient } from "../../types/patient.types";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    getPatient(id)
      .then(setPatient)
      .catch(() => setError("Could not load patient"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link to="/patients" className="text-sm text-slate-600">
          Back to patients
        </Link>

        {loading && <p>Loading patient...</p>}
        {error && <p role="alert" className="text-red-600">{error}</p>}

        {patient && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold">{patient.name}</h1>
            <div className="mt-5 space-y-2 text-slate-700">
              <p>Phone: {patient.phone || "Not provided"}</p>
              <p>
                Date of birth:{" "}
                {patient.dateOfBirth
                  ? patient.dateOfBirth.slice(0, 10)
                  : "Not provided"}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default PatientDetails;

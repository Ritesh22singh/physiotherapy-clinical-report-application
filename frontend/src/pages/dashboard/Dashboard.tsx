import Card from "../../components/common/Card";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { getPatients } from "../../services/patientService";
import { Link, useNavigate } from "react-router-dom";
import { endSession } from "../../services/session";

const Dashboard = () => {

  const [name, setName] = useState("clinician");
  const [patientCount, setPatientCount] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleLogout =() => {
    endSession();
    navigate("/login", {replace: true})
  }

 useEffect(() => {
  getCurrentUser()
    .then((user) => setName(user.name))
    .catch((error: unknown) => {
      console.error("Could not load user", error);
    });
}, [navigate]);

  useEffect(() => {
    getPatients()
      .then((patients) => setPatientCount(patients.length))
      .catch((error) => console.error("Could not load patient count", error));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-4xl bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)] ring-1 ring-white/10 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300/90">Physio report workspace</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {name}</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                Manage patient records, create professional reports, and keep your healthcare workflows streamlined from a single interface.
              </p>
            </div>
           <button
  type="button"
  onClick={handleLogout}
  className="self-start rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
>
  Log out
</button>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Patients</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">
              {patientCount === null ? "—" : patientCount}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Add patient profiles and keep their treatment history organized for every session.
            </p>
            <Link
              to="/patients"
              className="mt-4 inline-block text-sm font-semibold text-sky-700 hover:underline"
            >
              View patients
            </Link>
          </Card>

          <Card className="rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Reports</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">0</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Generate polished clinical reports for assessments, treatment plans, and progress tracking.
            </p>
          </Card>

          <Card className="rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Next step</p>
            <p className="mt-5 text-4xl font-semibold text-slate-900">Create report</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Use the report workflow to preview and export a professional PDF summary for your patient.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

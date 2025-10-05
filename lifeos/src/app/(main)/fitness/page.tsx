"use client";

import FitnessSummary from "./components/FitnessSummary";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutLog from "./components/WorkoutLog";

export default function FitnessPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Fitness Logger</h1>
        <WorkoutForm />
      </div>

      <FitnessSummary />

      <WorkoutLog />
    </div>
  );
}

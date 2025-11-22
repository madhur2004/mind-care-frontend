import { useState } from "react";
import BreathingExercise from "../components/BreathingExercise";

export default function Breathing({ userName }) {
  const [technique, setTechnique] = useState("4-7-8");

  const techniques = [
    {
      name: "4-7-8 Breathing",
      value: "4-7-8",
      description: "Inhale for 4, hold for 7, exhale for 8",
    },
    {
      name: "Box Breathing",
      value: "box",
      description: "Inhale, hold, exhale, hold for 4 counts each",
    },
    {
      name: "Alternate Nostril",
      value: "nostril",
      description: "Alternate breathing between nostrils",
    },
  ];

  return (
    <div className="breathing-page p-lg">
      <h1>Breathing Exercises</h1>
      <p>Practice calming breathing techniques, {userName}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mental-card">
          <h2>Choose Technique</h2>
          <div className="space-y-3 mt-4">
            {techniques.map((t) => (
              <button
                key={t.value}
                onClick={() => setTechnique(t.value)}
                className={`mental-btn mental-btn-large w-full text-left ${
                  technique === t.value
                    ? "mental-btn-primary"
                    : "mental-btn-outline"
                }`}
              >
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm opacity-80">{t.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <BreathingExercise technique={technique} />
      </div>
    </div>
  );
}

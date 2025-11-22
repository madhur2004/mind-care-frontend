import { useState, useEffect } from "react";

export default function BreathingExercise({ technique }) {
  const [phase, setPhase] = useState("inhale");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const phases = {
      "4-7-8": [
        { name: "Inhale", duration: 4000 },
        { name: "Hold", duration: 7000 },
        { name: "Exhale", duration: 8000 },
      ],
      box: [
        { name: "Inhale", duration: 4000 },
        { name: "Hold", duration: 4000 },
        { name: "Exhale", duration: 4000 },
        { name: "Hold", duration: 4000 },
      ],
      nostril: [
        { name: "Inhale Left", duration: 4000 },
        { name: "Hold", duration: 4000 },
        { name: "Exhale Right", duration: 4000 },
      ],
    };

    const selectedPhases = phases[technique] || phases["4-7-8"];
    let phaseIndex = 0;
    let phaseTimer;

    const runPhase = () => {
      const currentPhase = selectedPhases[phaseIndex];
      setPhase(currentPhase.name);

      phaseTimer = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % selectedPhases.length;
        runPhase();
      }, currentPhase.duration);
    };

    runPhase();
    return () => clearTimeout(phaseTimer);
  }, [isActive, technique]);

  return (
    <div className="mental-card text-center">
      <h2>
        {technique === "4-7-8"
          ? "4-7-8 Breathing"
          : technique === "box"
          ? "Box Breathing"
          : "Alternate Nostril"}
      </h2>
      <div
        style={{
          width: "200px",
          height: "200px",
          margin: "var(--spacing-lg) auto",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: isActive ? "pulse 4s ease-in-out infinite" : "none",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "var(--primary-color)",
            textAlign: "center",
          }}
        >
          {phase}
        </div>
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className={`mental-btn ${
          isActive ? "mental-btn-secondary" : "mental-btn-primary"
        } mental-btn-large`}
      >
        {isActive ? "⏸ Stop" : "▶ Start"}
      </button>
    </div>
  );
}

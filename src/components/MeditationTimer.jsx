import { useState, useEffect } from "react";

export default function MeditationTimer({ duration, onToggle, isPlaying }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ marginTop: "var(--spacing-lg)" }}>
      <div
        style={{
          fontSize: "4rem",
          fontWeight: "bold",
          color: "var(--primary-color)",
          marginBottom: "var(--spacing-lg)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <button
        onClick={onToggle}
        className={`mental-btn ${
          isPlaying ? "mental-btn-secondary" : "mental-btn-primary"
        } mental-btn-large`}
      >
        {isPlaying ? "⏸ Pause" : "▶ Start"}
      </button>
    </div>
  );
}

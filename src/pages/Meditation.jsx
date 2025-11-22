import { useState } from "react";
import MeditationTimer from "../components/MeditationTimer";
import { meditationAPI } from "../utils/api";

export default function Meditation({ userName }) {
  const [duration, setDuration] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMeditationComplete = async () => {
    try {
      await meditationAPI.start(duration * 60, "mindfulness");
      // You can show a success message or update stats
    } catch (error) {
      console.error("Error saving meditation:", error);
    }
  };

  return (
    <div className="meditation-page p-lg">
      <h1>Guided Meditation</h1>
      <p>Take a moment to relax and breathe, {userName}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mental-card text-center">
          <h2>Select Duration</h2>
          <div className="flex gap-4 justify-center mt-6">
            {[5, 10, 15].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`mental-btn ${
                  duration === d ? "mental-btn-primary" : "mental-btn-outline"
                }`}
              >
                {d}m
              </button>
            ))}
          </div>

          <MeditationTimer
            duration={duration}
            onToggle={() => setIsPlaying(!isPlaying)}
            isPlaying={isPlaying}
            onComplete={handleMeditationComplete}
          />
        </div>

        <div className="mental-card">
          <h2>Benefits of Meditation</h2>
          <ul className="space-y-3 mt-4">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Reduces stress and anxiety
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Improves focus and concentration
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Enhances emotional well-being
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Better sleep quality
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Increases self-awareness
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

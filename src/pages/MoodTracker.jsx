import { useState, useEffect } from "react";
import MoodSelector from "../components/MoodSelector";
import MoodChart from "../components/MoodChart";
import { moodAPI } from "../utils/api";

export default function MoodTracker({ userName }) {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const moodOptions = [
    { emoji: "😊", label: "Happy", value: "happy" },

    { emoji: "😢", label: "Sad", value: "sad" },
    { emoji: "🥳", label: "Excited", value: "excited" },
    { emoji: "😠", label: "Angry", value: "angry" },
    { emoji: "😴", label: "Tired", value: "tired" },
  ];

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await moodAPI.getAll();
      setMoods(response.data);
    } catch (error) {
      console.error("Error fetching moods:", error);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      const selectedMoodOption = moodOptions.find(
        (option) => option.value === selectedMood
      );
      const moodData = {
        mood: selectedMood,
        emoji: selectedMoodOption.emoji,
        notes: notes,
        intensity: 5,
      };

      await moodAPI.create(moodData);
      await fetchMoods(); // Refresh the list
      setSelectedMood("");
      setNotes("");
    } catch (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-tracker-page p-lg">
      <h1>Mood Tracker</h1>
      <p>How are you feeling {userName}?</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mental-card">
          <h2>Log Your Mood</h2>
          <MoodSelector
            moodOptions={moodOptions}
            selectedMood={selectedMood}
            onSelect={setSelectedMood}
          />

          <div className="mt-6">
            <label htmlFor="notes" className="block mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              className="mental-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today?"
            />
          </div>

          <button
            onClick={handleSaveMood}
            disabled={!selectedMood || loading}
            className="mental-btn mental-btn-primary mental-btn-large mt-4"
          >
            {loading ? "Saving..." : "Save Mood"}
          </button>
        </div>

        <MoodChart moods={moods} />
      </div>

      <div className="mental-card mt-6">
        <h2>Mood History</h2>
        {moods.length === 0 ? (
          <p>No moods logged yet. Start tracking your emotions!</p>
        ) : (
          <div className="space-y-4">
            {moods.map((mood) => (
              <div key={mood._id} className="mental-card">
                <div className="flex-between">
                  <span className="text-2xl">
                    {moodOptions.find((m) => m.value === mood.mood)?.emoji}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(mood.date).toLocaleDateString()}
                  </span>
                </div>
                {mood.notes && <p className="mt-2">{mood.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

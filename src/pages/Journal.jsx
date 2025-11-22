import { useState, useEffect } from "react";
import { journalAPI } from "../utils/api";

export default function Journal({ userName }) {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await journalAPI.getAll();
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  const handleSaveEntry = async () => {
    if (!title || !content) return;

    setLoading(true);
    try {
      const journalData = {
        title,
        content,
        mood,
        tags: [],
        isPrivate: true,
      };

      if (editingId) {
        await journalAPI.update(editingId, journalData);
        setEditingId(null);
      } else {
        await journalAPI.create(journalData);
      }

      await fetchJournals();
      setTitle("");
      setContent("");
      setMood("neutral");
    } catch (error) {
      console.error("Error saving journal:", error);
      alert("Failed to save journal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journal entry?"))
      return;

    try {
      await journalAPI.delete(id);
      await fetchJournals();
    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("Failed to delete journal. Please try again.");
    }
  };

  const handleEdit = (entry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || "neutral");
    setEditingId(entry._id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMood("neutral");
  };

  return (
    <div className="journal-page p-lg">
      <h1>My Journal</h1>
      <p>Write your thoughts and reflections, {userName}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="mental-card">
          <h2>{editingId ? "Edit Entry" : "New Entry"}</h2>

          <div className="mt-6">
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mental-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title..."
            />
          </div>

          <div className="mt-4">
            <label htmlFor="mood" className="block mb-2">
              Mood
            </label>
            <select
              id="mood"
              className="mental-select"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
              <option value="excited">Excited</option>
              <option value="angry">Angry</option>
              <option value="tired">Tired</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="content" className="block mb-2">
              Content
            </label>
            <textarea
              id="content"
              className="mental-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              rows="8"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSaveEntry}
              disabled={!title || !content || loading}
              className="mental-btn mental-btn-primary flex-1"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Save"} Entry
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="mental-btn mental-btn-outline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="mental-card">
          <h2>Your Entries</h2>
          {entries.length === 0 ? (
            <p>No entries yet. Start writing!</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry._id} className="mental-card">
                  <div className="flex-between">
                    <div>
                      <h3 className="text-lg font-semibold">{entry.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="mental-btn mental-btn-secondary mental-btn-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="mental-btn mental-btn-small bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-3">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

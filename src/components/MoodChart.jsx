export default function MoodChart({ moods }) {
  const moodCounts = moods.reduce((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(moodCounts), 1);

  return (
    <div className="mental-card">
      <h2>Mood Distribution</h2>
      {Object.entries(moodCounts).length === 0 ? (
        <p>No data yet. Log some moods to see your chart!</p>
      ) : (
        <div style={{ marginTop: "var(--spacing-lg)" }}>
          {Object.entries(moodCounts).map(([mood, count]) => (
            <div key={mood} style={{ marginBottom: "var(--spacing-md)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{mood}</span>
                <span>{count}</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "20px",
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "var(--border-radius)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    height: "100%",
                    backgroundColor: "var(--primary-color)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

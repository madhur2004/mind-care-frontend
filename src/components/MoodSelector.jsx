export default function MoodSelector({ moodOptions, selectedMood, onSelect }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
        gap: "var(--spacing-md)",
        marginTop: "var(--spacing-lg)",
      }}
    >
      {moodOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`mental-card ${
            selectedMood === option.value ? "mental-btn-primary" : ""
          }`}
          style={{
            padding: "var(--spacing-lg)",
            textAlign: "center",
            border:
              selectedMood === option.value
                ? "3px solid var(--primary-color)"
                : "1px solid var(--border-color)",
            cursor: "pointer",
            backgroundColor:
              selectedMood === option.value
                ? "var(--primary-light)"
                : "var(--bg-primary)",
            transition: "var(--transition)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}>
            {option.emoji}
          </div>
          <div style={{ fontSize: "var(--font-size-sm)" }}>{option.label}</div>
        </button>
      ))}
    </div>
  );
}

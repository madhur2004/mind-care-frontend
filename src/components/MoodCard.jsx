export default function MoodCard({ mood }) {
  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    excited: "🥳",
    angry: "😠",
    tired: "😴",
  };

  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--border-radius-lg)",
        backgroundColor: "var(--bg-accent)",
        fontSize: "2rem",
      }}
    >
      {moodEmojis[mood] || "😐"}
    </div>
  );
}

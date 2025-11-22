import { useState, useEffect } from "react";

export default function QuoteOfDay() {
  const [quote, setQuote] = useState("");

  const quotes = [
    "Your mental health is a priority, not a luxury.",
    "You are stronger than you think.",
    "One day at a time.",
    "Take care of your mind. It's the only one you get.",
    "Healing is a journey, not a destination.",
    "You deserve peace and happiness.",
    "Small steps lead to big changes.",
    "Be kind to yourself. You're doing your best.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div
      className="mental-card"
      style={{
        backgroundColor: "var(--primary-light)",
        color: "white",
        padding: "var(--spacing-xl)",
      }}
    >
      <h2>Quote of the Day</h2>
      <p
        style={{
          marginTop: "var(--spacing-lg)",
          fontSize: "var(--font-size-lg)",
          fontStyle: "italic",
        }}
      >
        "{quote}"
      </p>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { progressAPI } from "../utils/api";

export default function ProgressReports({
  isDarkMode: isDarkModeProp = undefined,
}) {
  const [stats, setStats] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof isDarkModeProp === "boolean") {
      setIsDarkMode(isDarkModeProp);
    } else if (typeof document !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, [isDarkModeProp]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching progress:", error);
      setStats({
        totalMoods: 0,
        totalJournals: 0,
        totalMeditationTime: 0,
        moodDistribution: [],
        streak: 0,
      });
    }
  };

  if (!stats) return <p className="text-center mt-10">Loading...</p>;

  const moodData = (stats.moodDistribution || []).map((item) => ({
    mood: item.mood,
    count: item.count,
  }));

  const lineData = moodData.map((item, i) => ({
    day: `Day ${i + 1}`,
    value: item.count,
  }));

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#facc15",
    "#ef4444",
    "#0ea5e9",
    "#a855f7",
  ];

  const rootClass = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";

  const cardBase = isDarkMode
    ? "bg-gray-800 text-white border border-gray-700 shadow-lg"
    : "bg-white text-gray-900 border border-gray-200 shadow-md";

  return (
    <div
      className={`min-h-screen px-4 py-12 transition-all duration-300 flex justify-center ${rootClass}`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16">
        {/* HEADER */}
        <h1 className="text-4xl font-extrabold text-center tracking-wide">
          📊 Progress Overview
        </h1>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Mood Logs", value: stats.totalMoods ?? 0, icon: "😊" },
            {
              title: "Journal Entries",
              value: stats.totalJournals ?? 0,
              icon: "📖",
            },
            {
              title: "Meditation",
              value: `${((stats.totalMeditationTime || 0) / 60).toFixed(
                1
              )} hrs`,
              icon: "🧘‍♂️",
            },
            {
              title: "Best Streak",
              value: `${stats.streak ?? 0} days`,
              icon: "🔥",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 flex flex-col items-center justify-center ${cardBase} hover:scale-105 transition-all duration-300`}
            >
              <div className="text-4xl mb-2">{card.icon}</div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <h2 className="text-3xl font-bold text-indigo-500 dark:text-indigo-300">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-2 sm:px-6">
          {/* PIE CHART */}
          <div className={`rounded-2xl p-8 md:p-10 ${cardBase}`}>
            <h3 className="text-xl font-semibold mb-6">Mood Distribution</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    dataKey="count"
                    nameKey="mood"
                    outerRadius={110}
                    label
                  >
                    {moodData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR CHART */}
          <div className={`rounded-2xl p-8 md:p-10 ${cardBase}`}>
            <h3 className="text-xl font-semibold mb-6">Mood Frequency</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    dataKey="mood"
                    tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                  />
                  <YAxis tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* LINE CHART FULL WIDTH */}
        <div className={`rounded-2xl p-8 ${cardBase}`}>
          <h3 className="text-xl font-semibold mb-6">📈 Mood Trend (Daily)</h3>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                />
                <YAxis tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

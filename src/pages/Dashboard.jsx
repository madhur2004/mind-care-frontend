import { useState, useEffect } from "react";
import MoodCard from "../components/MoodCard";
import QuoteOfDay from "../components/QuoteOfDay";
import { progressAPI, moodAPI } from "../utils/api";

export default function Dashboard({ userName }) {
  const [stats, setStats] = useState({
    totalEntries: 0,
    weeklyMoods: [],
    recentMoods: [],
    totalMoods: 0,
    totalJournals: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressResponse, moodsResponse] = await Promise.all([
        progressAPI.getStats(),
        moodAPI.getAll(),
      ]);

      const progressData = progressResponse.data;
      const moodsData = moodsResponse.data;

      setStats({
        totalEntries: progressData.totalJournals || 0,
        totalMoods: progressData.totalMoods || 0,
        totalJournals: progressData.totalJournals || 0,
        currentStreak: progressData.currentStreak || 0,
        recentMoods: moodsData.slice(0, 3).map((mood) => mood.mood) || [],
        weeklyMoods: progressData.moodDistribution || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback data
      setStats({
        totalEntries: 12,
        weeklyMoods: [
          { day: "Mon", mood: "happy", count: 1 },
          { day: "Tue", mood: "neutral", count: 1 },
          { day: "Wed", mood: "happy", count: 2 },
        ],
        recentMoods: ["happy", "neutral", "happy"],
        totalMoods: 28,
        totalJournals: 15,
        currentStreak: 7,
      });
    }
  };

  return (
    <div className="dashboard-page p-lg">
      <h1>Welcome back, {userName}!</h1>
      <p>Here's your wellness overview for today</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <QuoteOfDay />

        <div className="mental-card">
          <h2>Quick Stats</h2>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Moods Logged:</strong> {stats.totalMoods}
            </p>
            <p>
              <strong>Journal Entries:</strong> {stats.totalJournals}
            </p>
            <p>
              <strong>Current Streak:</strong> {stats.currentStreak} days
            </p>
          </div>
        </div>

        <div className="mental-card">
          <h2>Recent Moods</h2>
          <div className="flex gap-4 mt-4">
            {stats.recentMoods.length === 0 ? (
              <p>No moods logged yet</p>
            ) : (
              stats.recentMoods.map((mood, index) => (
                <MoodCard key={index} mood={mood} />
              ))
            )}
          </div>
        </div>
      </div>
      {/* 🎬 Video Gallery Section */}
      <div className="mental-card mt-6">
        <h2 className="text-xl font-bold mb-4">Guided Wellness Videos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {["vedio1.mp4", "vedio2.mp4", "vedio3.mp4", "vedio4.mp4"].map(
            (video, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-lg bg-black"
              >
                <video
                  src={`/vedios/${video}`}
                  controls
                  loading="lazy"
                  className="w-full h-[550px] object-cover"
                ></video>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

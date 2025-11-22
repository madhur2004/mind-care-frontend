import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import Journal from "./pages/Journal";
import ChatBot from "./pages/ChatBot";
import Meditation from "./pages/Meditation";
import Breathing from "./pages/Breathing";
import ProgressReports from "./pages/ProgressReports";
import Community from "./pages/Community";
import OAuthCallback from "./pages/OAuthCallback";
import Footer from "./components/Footer";

import {
  isAuthenticated,
  getUserName,
  setUserName,
  setAuthToken,
  removeAuthToken,
} from "./utils/auth";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUser] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // ✅ Check authentication first
    if (isAuthenticated()) {
      setIsAuth(true);
      setUser(getUserName() || "");
    }

    // ✅ Theme setup - localStorage se load karo
    const savedTheme = localStorage.getItem("mental-wellness-theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("mental-wellness-theme", theme);
  };

  const handleLogin = (token, name) => {
    console.log("🔐 App: handleLogin called with:", name);
    setIsAuth(true);
    setUser(name);
    setAuthToken(token);
    setUserName(name);
  };

  const handleLogout = () => {
    console.log("🚪 App: handleLogout called");
    setIsAuth(false);
    setUser("");
    removeAuthToken();
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* ✅ NAVIGATION - Always visible like footer */}
        <Navigation
          userName={userName}
          onLogout={handleLogout}
          onThemeToggle={toggleTheme}
          theme={theme}
          isAuth={isAuth} // Pass auth status to navigation
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/oauth-callback"
              element={<OAuthCallback onLogin={handleLogin} />}
            />

            <Route
              path="/"
              element={isAuth ? <Navigate to="/dashboard" /> : <LandingPage />}
            />

            <Route
              path="/login"
              element={
                isAuth ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                isAuth ? (
                  <Dashboard userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/mood-tracker"
              element={
                isAuth ? (
                  <MoodTracker userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/journal"
              element={
                isAuth ? (
                  <Journal userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/chat"
              element={
                isAuth ? (
                  <ChatBot userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/meditation"
              element={
                isAuth ? (
                  <Meditation userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/breathing"
              element={
                isAuth ? (
                  <Breathing userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/progress"
              element={
                isAuth ? (
                  <ProgressReports userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/community"
              element={
                isAuth ? (
                  <Community userName={userName} theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
        <Footer theme={theme} />
      </div>
    </BrowserRouter>
  );
}

export default App;

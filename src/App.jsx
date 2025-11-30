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

//--------------------------------------------------
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";

import {
  isAuthenticated,
  getUserName,
  setUserName,
  setAuthToken,
  removeAuthToken,
} from "./utils/auth";
import { authAPI } from "./utils/api"; // ✅ Import authAPI

// Main App Component
import { initializeNotifications, initializePWA } from "./utils/notifications";

function App() {
  // ✅ Global state for authentication and user data
  useEffect(() => {
    // Initialize PWA and notifications
    const initApp = async () => {
      console.log("🚀 Initializing Mental Wellness App...");

      // Initialize PWA install prompt
      initializePWA();

      // Initialize notifications
      await initializeNotifications();

      // Check if app is installed
      if (window.matchMedia("(display-mode: standalone)").matches) {
        console.log("📱 App running in standalone mode (PWA)");
      } else {
        console.log("🌐 App running in browser");
      }
    };

    initApp();
  }, []);

  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // ✅ Global user state
  const [authLoading, setAuthLoading] = useState(true); // ✅ Auth loading state
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // ✅ Check authentication and fetch user data
    checkAuthStatus();

    // ✅ Theme setup - localStorage se load karo
    const savedTheme = localStorage.getItem("mental-wellness-theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      const userData = response.data;
      setCurrentUser(userData);
      setUser(userData.name);
      setIsAuth(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      setIsAuth(false);
    } finally {
      setAuthLoading(false);
    }
  };

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
    // ✅ Login hone par user data fetch karo
    checkAuthStatus();
  };

  const handleLogout = () => {
    console.log("🚪 App: handleLogout called");
    setIsAuth(false);
    setUser("");
    setCurrentUser(null); // ✅ Clear current user
    removeAuthToken();
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // ✅ Agar auth check ho raha hai to loading show karo
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

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

            {/* ------------------ */}
            <Route
              path="/forgot-password"
              element={
                isAuth ? <Navigate to="/dashboard" /> : <ForgotPassword />
              }
            />
            <Route
              path="/reset-password"
              element={
                isAuth ? <Navigate to="/dashboard" /> : <ResetPassword />
              }
            />

            <Route
              path="/profile"
              element={
                isAuth ? (
                  <UserProfile
                    user={currentUser}
                    onUserUpdate={setCurrentUser}
                    userName={userName}
                    theme={theme}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/settings"
              element={
                isAuth ? (
                  <Settings
                    userName={userName}
                    theme={theme}
                    onThemeToggle={toggleTheme}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
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

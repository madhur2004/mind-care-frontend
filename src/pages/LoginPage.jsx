import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ REAL Google OAuth Function
  const handleRealGoogleOAuth = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      console.log("🎯 Starting Real Google OAuth...");

      // Step 1: Get Google OAuth URL from backend
      const response = await authAPI.getGoogleAuthUrl();

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to get OAuth URL");
      }

      const { authUrl } = response.data;
      console.log("🔐 Redirecting to Google OAuth...");

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("❌ Google OAuth failed:", error);
      setError(error.message || "Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  // ✅ Main Google Login Handler
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      // Use Real Google OAuth
      await handleRealGoogleOAuth();
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Rest of your email login code (keep as is)...
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (isSignup) {
        console.log("📝 Signing up with:", { email, name, password });
        response = await authAPI.register(email, name, password);
      } else {
        console.log("🔐 Logging in with:", { email, password });
        response = await authAPI.login(email, password);
      }

      const { token, user } = response.data;
      console.log("✅ Auth successful!");

      onLogin(token, user.name);
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Auth failed:", error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.details) {
        const validationErrors = error.response.data.details
          .map((err) => err.message)
          .join(", ");
        setError(validationErrors);
      } else if (error.message === "Network Error") {
        setError(
          "Cannot connect to server. Please check if backend is running."
        );
      } else {
        setError(
          isSignup
            ? "Signup failed. Please try again."
            : "Invalid email or password. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page flex-center"
      style={{
        minHeight: "100vh",
        padding: "var(--spacing-lg)",
        backgroundColor: "var(--bg-color)",
      }}
    >
      <div className="mental-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-md">🧠 Mental Wellness</h1>
        <p className="text-center mb-lg">
          {isSignup ? "Create your account" : "Sign in to your account"}
        </p>

        {error && (
          <div
            className="mental-card error-message"
            style={{
              backgroundColor: "var(--danger-color)",
              color: "white",
              marginBottom: "var(--spacing-md)",
              padding: "var(--spacing-md)",
            }}
          >
            {error}
          </div>
        )}

        {/* Email Login/Signup Form */}
        <form
          onSubmit={handleEmailAuth}
          className="gap-md flex"
          style={{ flexDirection: "column" }}
        >
          {isSignup && (
            <div>
              <label htmlFor="name" className="block mb-sm">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="mental-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required={isSignup}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mental-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mental-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
            />
            {isSignup && (
              <small
                style={{
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                  display: "block",
                }}
              >
                Password must be at least 6 characters
              </small>
            )}
          </div>

          <button
            type="submit"
            className="mental-btn mental-btn-primary mental-btn-large"
            disabled={loading}
            style={{ marginTop: "var(--spacing-md)" }}
          >
            {loading
              ? isSignup
                ? "Creating Account..."
                : "Signing in..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {/* Switch between Login/Signup */}
        <div className="text-center mt-md">
          <button
            type="button"
            className="mental-btn mental-btn-link"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            style={{
              color: "var(--primary-color)",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Google OAuth Section */}
        <div
          className="mt-md"
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "var(--spacing-lg)",
          }}
        >
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: "100%",
              padding: "var(--spacing-md) var(--spacing-lg)",
              backgroundColor: "white",
              color: "#333",
              border: "2px solid #ddd",
              borderRadius: "var(--border-radius)",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: googleLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--spacing-md)",
              opacity: googleLoading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              if (!googleLoading) {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.borderColor = "#ccc";
              }
            }}
            onMouseOut={(e) => {
              if (!googleLoading) {
                e.target.style.backgroundColor = "white";
                e.target.style.borderColor = "#ddd";
              }
            }}
          >
            {googleLoading ? (
              <>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #f3f3f3",
                    borderTop: "2px solid #4285f4",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Connecting to Google...
              </>
            ) : (
              <>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: "20px", height: "20px" }}
                />
                Continue with Google
              </>
            )}
          </button>

          {/* Updated Google OAuth Info */}
          <div
            style={{
              marginTop: "var(--spacing-sm)",
              padding: "var(--spacing-sm)",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "var(--border-radius)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              textAlign: "center",
            }}
          >
            <strong>Real Google OAuth:</strong> Any user can login with their
            Google account
          </div>
        </div>
      </div>

      {/* Add spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

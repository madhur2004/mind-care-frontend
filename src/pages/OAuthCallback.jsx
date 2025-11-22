import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function OAuthCallback({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FIX: Use ref to track if request was already made
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // ✅ Prevent duplicate requests
      if (hasProcessed.current) {
        console.log("🔄 OAuth callback already processed, skipping...");
        return;
      }

      hasProcessed.current = true;

      try {
        const code = searchParams.get("code");

        if (!code) {
          throw new Error("No authorization code received");
        }

        console.log("🔄 Processing OAuth callback with code:", code);

        // Send code to backend
        const response = await authAPI.googleAuthCallback(code);

        if (response.data.success) {
          const { token, user } = response.data;
          console.log("✅ OAuth successful for:", user.email);

          // ✅ Check if onLogin is a function before calling it
          if (onLogin && typeof onLogin === "function") {
            onLogin(token, user.name);
          } else {
            // Fallback: Store token and user info manually
            localStorage.setItem("authToken", token);
            localStorage.setItem("userName", user.name);
            console.log("✅ User logged in via OAuth (fallback)");
          }

          navigate("/dashboard");
        } else {
          throw new Error(response.data.error || "OAuth failed");
        }
      } catch (error) {
        console.error("❌ OAuth callback error:", error);

        // ✅ Don't show error for invalid_grant (code reuse)
        if (error.response?.data?.error === "invalid_grant") {
          console.log(
            "ℹ️ Google OAuth code was already used (normal behavior)"
          );
          // User is already logged in, redirect to dashboard
          navigate("/dashboard");
        } else {
          setError(error.message || "Authentication failed");
        }
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, onLogin]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #4285f4",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Completing Google authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div style={{ color: "var(--danger-color)", fontSize: "1.2rem" }}>
          ❌ Authentication Failed
        </div>
        <p>{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mental-btn mental-btn-primary"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return null;
}

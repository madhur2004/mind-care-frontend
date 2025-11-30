import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(token, newPassword);

      if (response.data.success) {
        setMessage(
          "Password reset successfully! You can now login with your new password."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="login-page flex-center"
        style={{ minHeight: "100vh", padding: "20px" }}
      >
        <div
          className="mental-card text-center"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h1 className="mb-md">❌ Invalid Reset Link</h1>
          <p className="mb-lg">
            The password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="mental-btn mental-btn-primary">
            Get New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="login-page flex-center"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div className="mental-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-md">🔄 Reset Password</h1>
        <p className="text-center mb-lg">Enter your new password below.</p>

        {error && (
          <div
            className="error-message mental-card"
            style={{
              backgroundColor: "var(--danger-color)",
              color: "white",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="success-message mental-card"
            style={{
              backgroundColor: "var(--success-color)",
              color: "white",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label htmlFor="newPassword" className="block mb-sm">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="mental-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <div className="mb-lg">
            <label htmlFor="confirmPassword" className="block mb-sm">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mental-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="mental-btn mental-btn-primary mental-btn-large"
            disabled={loading}
            style={{ width: "100%", marginBottom: "15px" }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="mental-btn mental-btn-link">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

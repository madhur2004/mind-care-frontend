import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authAPI.forgotPassword(email);

      if (response.data.success) {
        setMessage("Password reset link sent to your email!");
        setEmail("");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page flex-center"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div className="mental-card" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-center mb-md">🔒 Forgot Password</h1>
        <p className="text-center mb-lg">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

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
            <label htmlFor="email" className="block mb-sm">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mental-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="mental-btn mental-btn-primary mental-btn-large"
            disabled={loading}
            style={{ width: "100%", marginBottom: "15px" }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

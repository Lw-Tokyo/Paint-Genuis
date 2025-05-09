// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import AuthService from "../services/AuthService";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.forgotPassword(email);
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Error sending reset email");
      setMessage("");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Forgot Password</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-dark text-white">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-warning w-100">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
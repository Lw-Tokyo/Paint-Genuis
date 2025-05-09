// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.resetPassword(token, password);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Reset Password</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleReset} className="shadow p-4 rounded bg-dark text-white">
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success w-100">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;

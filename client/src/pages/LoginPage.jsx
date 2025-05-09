import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const user = await AuthService.login(email, password);
    setUser(user); // <-- this updates the context so Navbar updates

    switch (user.role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'contractor':
        navigate('/contractor/dashboard');
        break;
      case 'painter':
        navigate('/painter/dashboard');
        break;
      case 'client':
        navigate('/client/dashboard');
        break;
      default:
        setError('Unknown user role');
    }
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed.');
  }
};


  return (
    <div className="container mt-5">
      <motion.h2 
        className="mb-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Login
      </motion.h2>
      {error && <motion.div className="alert alert-danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
      <motion.form
        onSubmit={handleLogin}
        className="shadow p-4 rounded bg-dark text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3 text-end">
          <Link to="/forgot-password" className="text-info">Forgot Password?</Link>
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </motion.form>
      <motion.p 
        className="mt-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Don't have an account? <Link to="/signup" className="text-info">Sign up</Link>
      </motion.p>
    </div>
  );
}

export default LoginPage;

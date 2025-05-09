// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CostEstimatorPage from "./pages/CostEstimatorPage";
import BudgetPage from "./pages/BudgetPage";
import WallColorVisualizer from "./components/WallColorVisualizer";
import WallMaskGenerator from "./components/WallMaskGenerator";

// Dashboards
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import MessagesPage from "./pages/admin/MessagesPage";
import ContractorDashboard from "./pages/contractor/ContractorDashboard";
import PainterDashboard from "./pages/painter/PainterDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import AuthPage from "./pages/AuthPage";

// Routes
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container py-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/estimate" element={<CostEstimatorPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/WallColorVisualizer" element={<WallColorVisualizer />} />
          <Route path="/WallMaskGenerator" element={<WallMaskGenerator />} />
          <Route path="/auth" element={<AuthPage />} />


          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/messages" element={<MessagesPage />} />
          </Route>

          {/* Contractor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["contractor"]} />}>
            <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
          </Route>

          {/* Painter Routes */}
          <Route element={<ProtectedRoute allowedRoles={["painter"]} />}>
            <Route path="/painter/dashboard" element={<PainterDashboard />} />
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

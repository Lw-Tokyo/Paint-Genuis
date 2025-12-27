import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { UserContext } from "./context/UserContext";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CostEstimatorPage from "./pages/CostEstimatorPage";
import BudgetPage from "./pages/BudgetPage";
import WallColorVisualizer from "./components/WallColorVisualizer";
import { UserProvider } from "./context/UserContext"; 
import PaintCoverageCalculator from "./components/PaintCoverageCalculator";
import VerifyEmail from "./pages/VerifyEmail";

import AdminDashboardPage from "./pages/admin/AdminDashboard";
import AdminMessagesPage from "./pages/admin/MessagesPage";   
import ContractorDashboard from "./pages/contractor/ContractorDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import AuthPage from "./pages/AuthPage";
import ContractorsPage from "./pages/ContractorsPage";
import CreateContractorProfile from "./pages/contractor/CreateContractorProfile";
import ContractorProfilePage from "./pages/contractor/ContractorProfilePage";
import EditContractorProfile from "./pages/contractor/EditContractorProfile";
import MessagesPage from "./pages/messages/MessagesPage";     
import WallPaintVisualizer from "./pages/AIWallVisulaizer"
import ProjectTimelineEstimator from './components/ProjectTimelineEstimator';
import DiscountManagement from './pages/contractor/DiscountManagement';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailsPage from './pages/OrderDetailsPage';

import ProtectedRoute from "./components/routes/ProtectedRoute";

function AppContent() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const backgroundImages = {
    "/": "url('/home-bg.jpg')",
    "/estimate": "url('/4.jpg')",
    "/coverage-calculator": "url('/4.jpg')",
    "/WallColorVisualizer": "url('/4.jpg')",
    "/budget": "url('/5.jpg')",
    "/forgot-password": "url('/3.jpg')",
    "/reset-password/:token": "3.jpg')",
    "/about": "url('/1.jpg')",
    "/contact": "url('/5.jpg')",
    "/auth": "url('/3.JPG')"
  };

  const backgroundImage = backgroundImages[location.pathname] || "none";

  const isDashboardPage = location.pathname.includes('/dashboard');
  const noFooterPaths = ["/auth", "/forgot-password","/about", "/reset-password", "/verify-email"]; 
  const showFooter = !noFooterPaths.some(path => location.pathname.startsWith(path));

  const mainClassName = isDashboardPage && user ? "" : "container py-4";

  return (
    <div style={{ backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Navbar />
      <main className={mainClassName}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/estimate" element={<CostEstimatorPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/WallColorVisualizer" element={<WallColorVisualizer />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/coverage-calculator" element={<PaintCoverageCalculator />} />
          <Route path="/wallvisualizer" element={<WallPaintVisualizer />} />
          <Route path="/timeline-estimator" element={<ProjectTimelineEstimator />} />
          <Route path="/contractor/discounts" element={<DiscountManagement />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />

          {/* Client/Contractor Messaging */}
          <Route path="/messages" element={<MessagesPage />} />

          {/* Contractors */}
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/contractors/:id" element={<ContractorProfilePage />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/messages" element={<AdminMessagesPage />} /> 
          </Route>
          {/* Contractor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["contractor"]} />}>
            <Route path="/contractor/dashboard" element={<ContractorDashboard />} />
            <Route path="/contractor/create-profile" element={<CreateContractorProfile />} />
            <Route path="/contractor/profile" element={<ContractorProfilePage />} />
            <Route path="/contractor/edit-profile" element={<EditContractorProfile />} />
            <Route path="/contractor/edit/:id" element={<EditContractorProfile />} />
          </Route>

          {/* Client Routes */}
          <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
          </Route>
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;

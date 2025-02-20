import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AptitudeTests from "./components/AptitudeTests";
import TestInstructions from "./components/Instructions";
import TestPage from "./components/TestPage";
import Profile from "./components/Profile";
import AdminResults from "./components/AdminResults";
import ThankYou from "./pages/ThankYou";
import TechnicalInstructions from "./components/InstructionsTechnical";
import TechnicalTestPage from "./components/TestPage_technical";
import TechnicalTests from "./components/TechnicalTests";
import CodingRoundPage from "./components/CodingRoundPage";

// Helper function to check if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  useEffect(() => {
    // Prevent right-click (context menu)
    const preventRightClick = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', preventRightClick);
    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/aptitude-tests" element={<ProtectedRoute><AptitudeTests /></ProtectedRoute>} />
      <Route path="/test/:testId/instructions" element={<ProtectedRoute><TestInstructions /></ProtectedRoute>} />
      <Route path="/test/:testId" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><AdminResults /></ProtectedRoute>} />
      <Route path="/technical-tests" element={<ProtectedRoute><TechnicalTests /></ProtectedRoute>} />
      <Route path="/technicaltests/:testId/instructions" element={<ProtectedRoute><TechnicalInstructions /></ProtectedRoute>} />
      <Route path="/technicaltests/:testId" element={<ProtectedRoute><TechnicalTestPage /></ProtectedRoute>} />
      <Route path="/coding-round" element={<ProtectedRoute><CodingRoundPage /></ProtectedRoute>} />

    </Routes>
  );
};

export default App;

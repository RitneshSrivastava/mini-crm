import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import CampaignList from "./pages/CampaignList";
import NewCampaign from "./pages/NewCampaign";
import SegmentBuilder from "./pages/SegmentBuilder";
import SendMessage from "./pages/SendMessage";
import CampaignStats from "./pages/CampaignStats";
import AiRuleGenerator from "./pages/AiRuleGenerator";
import AddCustomer from "./pages/AddCustomer";
import AddOrder from "./pages/AddOrder";
import ViewCustomers from "./pages/ViewCustomers";

// Wrapper
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute token={token}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <PrivateRoute token={token}>
              <CampaignList />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns/new"
          element={
            <PrivateRoute token={token}>
              <NewCampaign />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns/stats/:id"
          element={
            <PrivateRoute token={token}>
              <CampaignStats />
            </PrivateRoute>
          }
        />
        <Route
          path="/segments/new"
          element={
            <PrivateRoute token={token}>
              <SegmentBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/send-message"
          element={
            <PrivateRoute token={token}>
              <SendMessage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai/generate"
          element={
            <PrivateRoute token={token}>
              <AiRuleGenerator />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers/add"
          element={
            <PrivateRoute token={token}>
              <AddCustomer />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute token={token}>
              <ViewCustomers />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/add"
          element={
            <PrivateRoute token={token}>
              <AddOrder />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

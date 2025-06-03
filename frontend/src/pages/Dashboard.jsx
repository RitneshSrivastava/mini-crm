import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCampaigns: 0,
    totalSegments: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [customersRes, campaignsRes, segmentsRes] = await Promise.all([
        api.get("/api/customers"),
        api.get("/api/campaigns"),
        api.get("/api/segments")
      ]);

      setStats({
        totalCustomers: customersRes.data.length,
        totalCampaigns: campaignsRes.data.length,
        totalSegments: segmentsRes.data.length
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-blue-700">Welcome to Mini CRM 👋</h1>
            <p className="text-gray-600">Manage your customers, segments, and campaigns all in one place</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-100 text-red-600 px-4 py-2 rounded shadow hover:bg-red-200 flex items-center gap-2"
          >
            🔓 Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Campaigns</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCampaigns}</p>
              </div>
              <div className="text-3xl">📧</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Segments</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalSegments}</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">📧 Campaign Management</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/campaigns/new")}
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 text-left flex items-center gap-2"
              >
                ➕ Create New Campaign
              </button>
              <button
                onClick={() => navigate("/campaigns")}
                className="w-full bg-white border border-gray-300 p-3 rounded hover:bg-gray-50 text-left flex items-center gap-2"
              >
                📊 View Campaign History
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">🎯 Audience Segmentation</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/segments/new")}
                className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 text-left flex items-center gap-2"
              >
                🧠 Build New Segment
              </button>
              <button
                onClick={() => navigate("/ai/generate")}
                className="w-full bg-white border border-gray-300 p-3 rounded hover:bg-gray-50 text-left flex items-center gap-2"
              >
                🤖 AI Rule Generator
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-green-700">👥 Customer Management</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/customers/add")}
                className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 text-left flex items-center gap-2"
              >
                ➕ Add Customer
              </button>
              <button
                onClick={() => navigate("/customers")}
                className="w-full bg-white border border-gray-300 p-3 rounded hover:bg-gray-50 text-left flex items-center gap-2"
              >
                👁️ View All Customers
              </button>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">📦 Order Management</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/orders/add")}
                className="w-full bg-orange-600 text-white p-3 rounded hover:bg-orange-700 text-left flex items-center gap-2"
              >
                ➕ Add Order
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">📤 Direct Messaging</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/send-message")}
                className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 text-left flex items-center gap-2"
              >
                📤 Send Test Message
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">💡 Quick Tips</h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Start by adding customers and their order data</li>
            <li>• Create segments based on customer behavior (spend, visits, etc.)</li>
            <li>• Use AI to generate natural language rules for complex segments</li>
            <li>• Personalize your campaign messages with {"{name}"}, {"{totalSpend}"}, etc.</li>
            <li>• Monitor campaign performance in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
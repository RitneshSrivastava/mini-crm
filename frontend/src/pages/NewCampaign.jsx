import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const NewCampaign = () => {
  const [name, setName] = useState("");
  const [segmentId, setSegmentId] = useState("");
  const [message, setMessage] = useState("");
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audiencePreview, setAudiencePreview] = useState(null);
  const navigate = useNavigate();

  // Message templates for inspiration
  const messageTemplates = [
    "Hi {name}, here's 10% off on your next order! 🎉",
    "Hello {firstName}, we miss you! Come back for exclusive deals.",
    "Dear {name}, based on your {visits} visits, here's a special offer just for you!",
    "Hi {name}, thank you for spending ₹{totalSpend} with us. Here's a loyalty reward!",
    "Hey {firstName}, it's been a while! Here's 15% off to welcome you back.",
  ];

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await api.get("/api/segments");
      setSegments(response.data);
    } catch (error) {
      console.error("Failed to fetch segments:", error);
    }
  };

  const handleSegmentChange = async (selectedSegmentId) => {
    setSegmentId(selectedSegmentId);

    if (selectedSegmentId) {
      try {
        const segment = segments.find(s => s.id.toString() === selectedSegmentId);
        if (segment && segment.ruleLogic) {
          const response = await api.post("/api/segments/preview", {
            ruleLogic: segment.ruleLogic
          });
          setAudiencePreview(response.data);
        }
      } catch (error) {
        console.error("Failed to preview audience:", error);
      }
    } else {
      setAudiencePreview(null);
    }
  };

  const useTemplate = (template) => {
    setMessage(template);
  };

  const generateAIMessage = async () => {
    const segmentName = segments.find(s => s.id.toString() === segmentId)?.name || "customers";
    const prompt = `Generate a personalized marketing message for ${segmentName}. Make it engaging and include personalization placeholders like {name} or {firstName}.`;

    try {
      setLoading(true);
      const response = await api.post("/api/ai/generate-rule", { prompt });
      setMessage(response.data);
    } catch (error) {
      alert("Failed to generate AI message");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!segmentId) {
      alert("Please select a segment");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      // Find the selected segment
      const selectedSegment = segments.find(s => s.id.toString() === segmentId);

      await api.post("/api/campaigns", {
        name,
        message,
        segment: selectedSegment
      });

      alert("✅ Campaign created and messages are being sent!");
      navigate("/campaigns");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create campaign: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">📧 Create New Campaign</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Summer Sale 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Target Segment</label>
              <select
                required
                value={segmentId}
                onChange={(e) => handleSegmentChange(e.target.value)}
                className="mt-1 block w-full border px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a segment</option>
                {segments.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.name}
                  </option>
                ))}
              </select>
              {segments.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No segments found. <a href="/segments/new" className="text-blue-600">Create one first</a>
                </p>
              )}
            </div>

            {/* Message Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Templates</label>
              <div className="grid grid-cols-1 gap-2 mb-3">
                {messageTemplates.slice(0, 3).map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => useTemplate(template)}
                    className="text-left text-sm bg-gray-50 hover:bg-gray-100 p-2 rounded border"
                  >
                    {template}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={generateAIMessage}
                disabled={loading || !segmentId}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:bg-gray-400"
              >
                🤖 Generate AI Message
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Campaign Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full border px-4 py-2 rounded h-32 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your personalized message here. Use {name}, {firstName}, {totalSpend}, {visits} for personalization."
              />
              <p className="text-sm text-gray-500 mt-1">
                💡 Use placeholders: {"{name}"} {"{firstName}"} {"{totalSpend}"} {"{visits}"}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    🚀 Launch Campaign
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Audience Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📊 Audience Preview</h3>

          {audiencePreview ? (
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <div className="mb-4">
                <h4 className="font-semibold text-blue-800">
                  Target Audience: {audiencePreview.count} customers
                </h4>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <h5 className="font-medium mb-2">Sample Recipients:</h5>
                {audiencePreview.customers && audiencePreview.customers.length > 0 ? (
                  <ul className="space-y-2">
                    {audiencePreview.customers.slice(0, 5).map((customer) => (
                      <li key={customer.id} className="text-sm bg-white p-2 rounded border">
                        <strong>{customer.name}</strong>
                        <br />
                        <span className="text-gray-600">
                          {customer.email}
                        </span>
                        <br />
                        <span className="text-gray-600">
                          Spend: ₹{customer.totalSpend} | Visits: {customer.visits}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No customers in this segment</p>
                )}
              </div>

              {/* Message Preview */}
              {message && audiencePreview.customers && audiencePreview.customers.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 className="font-medium mb-2">📝 Message Preview:</h5>
                  <div className="text-sm">
                    {message
                      .replace('{name}', audiencePreview.customers[0].name || 'Customer')
                      .replace('{firstName}', (audiencePreview.customers[0].name || 'Customer').split(' ')[0])
                      .replace('{totalSpend}', audiencePreview.customers[0].totalSpend || '0')
                      .replace('{visits}', audiencePreview.customers[0].visits || '0')
                    }
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-gray-600">
              Select a segment to preview your audience
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCampaign;
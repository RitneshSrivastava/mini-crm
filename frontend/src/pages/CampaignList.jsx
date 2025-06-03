import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignStats, setCampaignStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      // Fetch campaigns
      const campaignsRes = await api.get("/api/campaigns");
      const campaignsData = campaignsRes.data;
      setCampaigns(campaignsData);

      // Fetch stats for each campaign
      const statsPromises = campaignsData.map(campaign =>
        api.get(`/api/campaigns/stats/${campaign.id}`)
          .then(res => ({ campaignId: campaign.id, stats: res.data }))
          .catch(err => ({ campaignId: campaign.id, stats: null }))
      );

      const statsResults = await Promise.all(statsPromises);
      const statsMap = {};
      statsResults.forEach(result => {
        statsMap[result.campaignId] = result.stats;
      });
      setCampaignStats(statsMap);

    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (stats) => {
    if (!stats) return <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">Loading...</span>;

    const successRate = stats.total > 0 ? (stats.sent / stats.total) * 100 : 0;

    if (successRate >= 95) {
      return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Excellent</span>;
    } else if (successRate >= 85) {
      return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">Good</span>;
    } else if (successRate >= 70) {
      return <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-800">Fair</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Poor</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">📊 Campaign History</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/campaigns/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              ➕ New Campaign
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              🏠 Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-xl font-semibold mb-2">No campaigns yet</h2>
            <p className="text-gray-600 mb-4">Start by creating your first campaign to reach your customers</p>
            <button
              onClick={() => navigate("/campaigns/new")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create First Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((campaign) => {
                const stats = campaignStats[campaign.id];
                const successRate = stats && stats.total > 0 ? ((stats.sent / stats.total) * 100).toFixed(1) : 0;

                return (
                  <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-800">
                            {campaign.name || `Campaign #${campaign.id}`}
                          </h2>
                          {getStatusBadge(stats)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Campaign Message:</p>
                            <p className="text-gray-800 bg-gray-50 p-2 rounded text-sm">
                              {campaign.message || "No message specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Target Segment:</p>
                            <p className="text-gray-800">
                              {campaign.segment ? campaign.segment.name : "All Customers"}
                            </p>
                            {campaign.segment && (
                              <p className="text-xs text-gray-500 mt-1">
                                Rule: {campaign.segment.ruleLogic}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>📅 Created: {formatDate(campaign.createdAt)}</span>
                          <span>🆔 ID: {campaign.id}</span>
                        </div>
                      </div>

                      <div className="ml-6 text-right">
                        {stats ? (
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Sent</div>

                            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                              <div className="bg-green-50 px-2 py-1 rounded">
                                <div className="font-semibold text-green-700">{stats.sent}</div>
                                <div className="text-green-600">Delivered</div>
                              </div>
                              <div className="bg-red-50 px-2 py-1 rounded">
                                <div className="font-semibold text-red-700">{stats.failed}</div>
                                <div className="text-red-600">Failed</div>
                              </div>
                            </div>

                            <div className="mt-2">
                              <div className="text-sm font-semibold text-gray-700">{successRate}% Success</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            <div className="animate-pulse">Loading stats...</div>
                          </div>
                        )}

                        <button
                          onClick={() => navigate(`/campaigns/stats/${campaign.id}`)}
                          className="mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          📈 View Details
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {stats && stats.total > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Delivery Progress</span>
                          <span>{successRate}% delivered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignList;
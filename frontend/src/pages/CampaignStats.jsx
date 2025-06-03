import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const CampaignStats = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/campaigns/stats/${id}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">📈 Campaign Stats (ID: {id})</h1>
      {loading ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <div className="bg-white p-6 rounded shadow space-y-2">
          <p><strong>Sent:</strong> {stats.sent}</p>
          <p><strong>Failed:</strong> {stats.failed}</p>
          <p><strong>Total:</strong> {stats.total}</p>
        </div>
      ) : (
        <p>No data found for this campaign.</p>
      )}
    </div>
  );
};

export default CampaignStats;

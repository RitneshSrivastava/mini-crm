import { useState } from "react";
import api from "../services/api";

const AiRuleGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/ai/generate-rule", { prompt });
      setRules(res.data.rules || []);
    } catch (err) {
      console.error("AI generation failed", err);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">🤖 AI Rule Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          placeholder="e.g. People in Mumbai over 30"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Rules"}
        </button>
      </form>

      {rules.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Generated Rules:</h2>
          <ul className="list-disc pl-5">
            {rules.map((rule, index) => (
              <li key={index} className="text-sm">
                {rule.field} {rule.operator} {rule.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AiRuleGenerator;
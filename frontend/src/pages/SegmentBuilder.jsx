import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const SegmentBuilder = () => {
  const [rules, setRules] = useState([{ field: "", operator: "", value: "" }]);
  const [segmentName, setSegmentName] = useState("");
  const [ruleLogic, setRuleLogic] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const fields = [
    { value: "age", label: "Age" },
    { value: "location", label: "Location" },
    { value: "gender", label: "Gender" },
    { value: "totalSpend", label: "Total Spend" },
    { value: "visits", label: "Visits" },
    { value: "lastOrderDate", label: "Last Order Date" }
  ];

  const operators = [
    { value: "=", label: "equals" },
    { value: "!=", label: "not equals" },
    { value: ">", label: "greater than" },
    { value: "<", label: "less than" },
    { value: ">=", label: "greater than or equal" },
    { value: "<=", label: "less than or equal" },
    { value: "contains", label: "contains" }
  ];

  const handleRuleChange = (index, key, value) => {
    const updatedRules = [...rules];
    updatedRules[index][key] = value;
    setRules(updatedRules);
    generateRuleLogic(updatedRules);
  };

  const addRule = () => {
    setRules([...rules, { field: "", operator: "", value: "" }]);
  };

  const removeRule = (index) => {
    if (rules.length > 1) {
      const updatedRules = [...rules];
      updatedRules.splice(index, 1);
      setRules(updatedRules);
      generateRuleLogic(updatedRules);
    }
  };

  const generateRuleLogic = (currentRules) => {
    const validRules = currentRules.filter(rule =>
      rule.field && rule.operator && rule.value
    );

    if (validRules.length === 0) {
      setRuleLogic("");
      return;
    }

    const logicParts = validRules.map(rule => {
      if (rule.operator === "contains") {
        return `${rule.field} contains '${rule.value}'`;
      } else if (rule.field === "lastOrderDate") {
        return `${rule.field} ${rule.operator} ${rule.value} days ago`;
      } else {
        return `${rule.field} ${rule.operator} ${rule.value}`;
      }
    });

    setRuleLogic(logicParts.join(" AND "));
  };

  const previewAudience = async () => {
    if (!ruleLogic.trim()) {
      setValidationError("Please build some rules first");
      return;
    }

    setLoading(true);
    setValidationError("");

    try {
      const response = await api.post("/api/segments/preview", { ruleLogic });
      setPreviewData(response.data);
    } catch (error) {
      setValidationError(error.response?.data?.error || "Failed to preview audience");
      setPreviewData(null);
    } finally {
      setLoading(false);
    }
  };

  const validateRule = async () => {
    if (!ruleLogic.trim()) return;

    try {
      const response = await api.post("/api/segments/validate", { ruleLogic });
      if (!response.data.valid) {
        setValidationError(response.data.error);
      } else {
        setValidationError("");
      }
    } catch (error) {
      setValidationError("Rule validation failed");
    }
  };

  useEffect(() => {
    if (ruleLogic) {
      const debounceTimer = setTimeout(() => {
        validateRule();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [ruleLogic]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ruleLogic.trim()) {
      setValidationError("Please build some rules first");
      return;
    }

    try {
      await api.post("/api/segments", {
        name: segmentName,
        ruleLogic: ruleLogic
      });

      alert("✅ Segment created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save segment: " + (err.response?.data?.error || err.message));
    }
  };

  const handleNaturalLanguageGeneration = async () => {
    const prompt = window.prompt("Describe your target audience in natural language:");
    if (!prompt) return;

    try {
      setLoading(true);
      const response = await api.post("/api/ai/generate-rule", { prompt });
      setRuleLogic(response.data);
      // Parse the generated rule back to individual rules if possible
    } catch (error) {
      alert("Failed to generate rules from natural language");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">🧠 Segment Rule Builder</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rule Builder Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Segment Name</label>
              <input
                type="text"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder="e.g. High Value Customers"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Build Rules</h3>
                <button
                  type="button"
                  onClick={handleNaturalLanguageGeneration}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  🤖 Generate with AI
                </button>
              </div>

              {rules.map((rule, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded">
                  <select
                    value={rule.field}
                    onChange={(e) => handleRuleChange(index, "field", e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                    required
                  >
                    <option value="">Select field</option>
                    {fields.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) => handleRuleChange(index, "operator", e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                    required
                  >
                    <option value="">Select operator</option>
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => handleRuleChange(index, "value", e.target.value)}
                    className="border px-3 py-2 rounded flex-1"
                    placeholder="Enter value"
                    required
                  />

                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="text-red-500 text-lg hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addRule}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                + Add Rule (AND)
              </button>
            </div>

            {/* Generated Rule Logic */}
            <div>
              <label className="block text-sm font-medium">Generated Rule Logic</label>
              <textarea
                value={ruleLogic}
                onChange={(e) => setRuleLogic(e.target.value)}
                className="w-full border p-2 rounded mt-1 h-20"
                placeholder="Rules will appear here as you build them..."
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={previewAudience}
                disabled={loading || !ruleLogic.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Loading..." : "👀 Preview Audience"}
              </button>

              <button
                type="submit"
                disabled={loading || !segmentName.trim() || !ruleLogic.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                💾 Save Segment
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Audience Preview</h3>

          {previewData ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <div className="mb-4">
                <h4 className="font-semibold text-green-800">
                  📊 Audience Size: {previewData.count} customers
                </h4>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <h5 className="font-medium mb-2">Sample Customers:</h5>
                {previewData.customers && previewData.customers.length > 0 ? (
                  <ul className="space-y-2">
                    {previewData.customers.slice(0, 10).map((customer) => (
                      <li key={customer.id} className="text-sm bg-white p-2 rounded border">
                        <strong>{customer.name}</strong> - {customer.email}
                        <br />
                        <span className="text-gray-600">
                          Spend: ₹{customer.totalSpend} | Visits: {customer.visits}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No customers match this criteria</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center text-gray-600">
              Build rules and click "Preview Audience" to see who matches your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SegmentBuilder;
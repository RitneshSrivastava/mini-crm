// File: src/pages/SendMessage.jsx
import { useState } from "react";
import api from "../services/api";

const SendMessage = () => {
  const [form, setForm] = useState({
    customerId: "",
    campaignId: "",
    message: "",
    status: "SENT", // Optional based on backend handling
  });
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/vendor/send", form);
      setResponse("✅ " + res.data);
    } catch (err) {
      setResponse("❌ Message send failed");
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">📤 Send Campaign Message</h1>
      <form className="bg-white p-6 rounded shadow space-y-4" onSubmit={handleSubmit}>
        <input
          type="number"
          name="customerId"
          placeholder="Customer ID"
          value={form.customerId}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <input
          type="number"
          name="campaignId"
          placeholder="Campaign ID"
          value={form.campaignId}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <textarea
          name="message"
          placeholder="Enter message..."
          value={form.message}
          onChange={handleChange}
          className="w-full p-2 border"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
      {response && <p className="mt-4">{response}</p>}
    </div>
  );
};

export default SendMessage;

import { useState } from "react";
import api from "../services/api";

const AddOrder = () => {
  const [order, setOrder] = useState({
    customerId: "",
    amount: "",
    orderDate: "",
  });
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        customerId: parseInt(order.customerId),
        amount: parseInt(order.amount),
        orderDate: order.orderDate,
      };

      const res = await api.post("/api/orders", payload);
      setResponse("✅ " + res.data);
    } catch (err) {
      setResponse("❌ Failed to add order");
      console.error(err);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">➕ Add Order</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {["customerId", "amount", "orderDate"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "orderDate" ? "date" : "number"}
            placeholder={field}
            value={order[field]}
            onChange={handleChange}
            className="w-full p-2 border"
            required
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {response && <p className="mt-4">{response}</p>}
    </div>
  );
};

export default AddOrder;

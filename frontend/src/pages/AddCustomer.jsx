import { useState } from "react";

const AddCustomer = () => {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    totalSpend: "",
    visits: "",
    lastOrderDate: "",
  });

  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const fixDate = (dateStr) => {
    const parts = dateStr.includes("/") ? dateStr.split("/") : dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [a, b, c] = parts.map((x) => x.padStart(2, "0"));
    if (c.length === 4) {
      const year = c;
      const month = parseInt(b) > 12 ? a : b;
      const day = parseInt(b) > 12 ? b : a;
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: customer.name,
      email: customer.email,
      age: parseInt(customer.age),
      gender: customer.gender,
      location: customer.location,
      totalSpend: parseInt(customer.totalSpend),
      visits: parseInt(customer.visits),
      lastOrderDate: fixDate(customer.lastOrderDate),
    };

    console.log("Submitting payload:", payload);

    try {
      const res = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add customer");
      }

      const text = await res.text();
      setResponse("✅ " + text);
    } catch (error) {
      console.error("Customer add error:", error);
      setResponse("❌ Failed to add customer: " + error.message);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">➕ Add Customer</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {["name", "email", "age", "gender", "location", "totalSpend", "visits", "lastOrderDate"].map((field) => (
          <input
            key={field}
            name={field}
            type={
              field === "age" || field === "totalSpend" || field === "visits"
                ? "number"
                : "text"
            }
            placeholder={field === "lastOrderDate" ? "DD-MM-YYYY or YYYY-MM-DD" : field}
            value={customer[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
      {response && <p className="mt-4 text-red-600">{response}</p>}
    </div>
  );
};

export default AddCustomer;

import { useEffect, useState } from "react";
import api from "../services/api";

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/api/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers:", err.response?.data || err.message);
        setError("Failed to fetch customers.");
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">📋 View Customers</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Age</th>
                <th className="py-2 px-4">Gender</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Total Spend</th>
                <th className="py-2 px-4">Visits</th>
                <th className="py-2 px-4">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{c.name}</td>
                  <td className="py-2 px-4">{c.email}</td>
                  <td className="py-2 px-4">{c.age}</td>
                  <td className="py-2 px-4">{c.gender}</td>
                  <td className="py-2 px-4">{c.location}</td>
                  <td className="py-2 px-4">{c.totalSpend}</td>
                  <td className="py-2 px-4">{c.visits}</td>
                  <td className="py-2 px-4">{c.lastOrderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewCustomers;

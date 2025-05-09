// src/components/CostEstimatorForm.js
import React, { useState } from "react";
import axios from "axios";

function CostEstimatorForm({ onEstimate }) {
  const [form, setForm] = useState({
    length: "",
    width: "",
    height: "",
    paintType: "standard",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/estimate", form);
      setResult(res.data);

      // Send total cost back to parent if callback is provided
      if (onEstimate) {
        onEstimate(res.data.totalCost);
      }
    } catch (err) {
      console.error(err);
      alert("Error calculating estimate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Length (ft)</label>
        <input
          type="number"
          name="length"
          value={form.length}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Width (ft)</label>
        <input
          type="number"
          name="width"
          value={form.width}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Height (ft)</label>
        <input
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
          required
          className="block w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Paint Type</label>
        <select
          name="paintType"
          value={form.paintType}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Estimate Cost"}
      </button>

      {result && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <p><strong>Area:</strong> {result.area} sq ft</p>
          <p><strong>Paint Cost:</strong> ${result.paintCost}</p>
          <p><strong>Labor Cost:</strong> ${result.laborCost}</p>
          <p><strong>Total Cost:</strong> ${result.totalCost}</p>
        </div>
      )}
    </form>
  );
}

export default CostEstimatorForm;

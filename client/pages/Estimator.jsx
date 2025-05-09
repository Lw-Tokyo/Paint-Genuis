import React, { useState } from "react";

function Estimator() {
  const [inputs, setInputs] = useState({ length: "", width: "", quality: "mid" });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Paint Cost Estimator</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="length" type="number" placeholder="Room Length (ft)" onChange={handleChange} required />
        <input name="width" type="number" placeholder="Room Width (ft)" onChange={handleChange} required />
        <select name="quality" onChange={handleChange} defaultValue="mid">
          <option value="affordable">Affordable</option>
          <option value="mid">Mid-Range</option>
          <option value="premium">Premium</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-1 rounded">Estimate</button>
      </form>
      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <p>Area: {result.area} sq.ft</p>
          <p>Paint Cost: ${result.paintCost.toFixed(2)}</p>
          <p>Labor Cost: ${result.laborCost.toFixed(2)}</p>
          <p><strong>Total: ${result.total.toFixed(2)}</strong></p>
        </div>
      )}
    </div>
  );
}

export default Estimator;

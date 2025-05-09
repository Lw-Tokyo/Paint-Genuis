import React, { useState } from 'react';

const CostEstimatorForm = () => {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    paintType: 'standard',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Paint Cost Estimator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Length (ft)</label>
          <input type="number" name="length" value={formData.length} onChange={handleChange} className="w-full p-2 border rounded-xl" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Width (ft)</label>
          <input type="number" name="width" value={formData.width} onChange={handleChange} className="w-full p-2 border rounded-xl" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Height (ft)</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-2 border rounded-xl" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Paint Type</label>
          <select name="paintType" value={formData.paintType} onChange={handleChange} className="w-full p-2 border rounded-xl">
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700">
          {loading ? 'Estimating...' : 'Estimate Cost'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Estimate Result</h3>
          <p><strong>Area:</strong> {result.area} sq ft</p>
          <p><strong>Paint Cost:</strong> ${result.paintCost}</p>
          <p><strong>Labor Cost:</strong> ${result.laborCost}</p>
          <p><strong>Total Cost:</strong> ${result.totalCost}</p>
        </div>
      )}
    </div>
  );
};

export default CostEstimatorForm;

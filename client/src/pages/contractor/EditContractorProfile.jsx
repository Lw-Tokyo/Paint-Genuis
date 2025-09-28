import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

function EditContractorProfilePage() {
  const { id } = useParams(); // contractor _id
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    services: "",
    experience: "",
    location: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/contractors/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/contractors/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("✅ Profile updated successfully!");
      navigate("/contractor/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <DashboardLayout role="contractor">
      <h2 className="mb-4">✏️ Edit Contractor Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="services"
          value={formData.services}
          onChange={handleChange}
          placeholder="Services"
          className="w-full p-2 border rounded"
        />
        <input
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
          className="w-full p-2 border rounded"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </DashboardLayout>
  );
}

export default EditContractorProfilePage;

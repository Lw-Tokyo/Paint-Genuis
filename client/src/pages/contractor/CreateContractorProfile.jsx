// client/src/pages/contractor/CreateContractorProfile.jsx 
import React, { useState } from "react";
import axios from "axios";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

function CreateContractorProfile() {
  const navigate = useNavigate(); // ✅ put this at top level

  const [formData, setFormData] = useState({
    companyName: "",
    services: "",
    location: { city: "", state: "", country: "" },
    experienceYears: "",
    contactNumber: "",
    bio: "",
    availability: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["city", "state", "country"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const user = AuthService.getCurrentUser();
      const token = user?.token;

      const res = await axios.post(
        "http://localhost:5000/api/contractors",
        {
          ...formData,
          userId: user.id, // Attach user ID when creating
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Profile Created:", res.data);
      setMessage("✅ Profile created successfully!");

      setTimeout(() => {
        navigate("/contractor/dashboard"); // ✅ works now
      }, 1500);
    } catch (err) {
      console.error("❌ Error creating profile:", err.response?.data || err.message);
      setMessage("❌ Error creating profile.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="mb-4 text-center text-primary">➕ Create Contractor Profile</h2>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Services</label>
            <input
              type="text"
              className="form-control"
              name="services"
              value={formData.services}
              onChange={handleChange}
              required
            />
            <small className="text-muted">Example: Painting, Interior Design</small>
          </div>

          <div className="col-md-4">
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={formData.location.state}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Experience (Years)</label>
            <input
              type="number"
              className="form-control"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Short Bio</label>
            <textarea
              className="form-control"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="col-12">
            <label className="form-label">Availability</label>
            <input
              type="text"
              className="form-control"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            />
            <small className="text-muted">Example: Mon–Fri, 9 AM – 5 PM</small>
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-success px-4">
              🚀 Create Profile
            </button>
          </div>
        </form>

        {message && <p className="mt-3 text-center fw-bold">{message}</p>}
      </div>
    </div>
  );
}

export default CreateContractorProfile;

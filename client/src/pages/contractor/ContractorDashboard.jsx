import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import "./ContractorDashboard.css";

const ContractorDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("view");
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    availability: "",
    location: "",
    bio: "",
  });

  // Fetch contractor profile on mount
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:5000/api/contractors/${user._id}`)
        .then((res) => {
          setProfile(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            specialization: res.data.specialization || "",
            availability: res.data.availability || "",
            location: res.data.location || "",
            bio: res.data.bio || "",
          });
        })
        .catch((err) => console.error("❌ Fetch profile error:", err));
    }
  }, [user]);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/contractors/${user._id}`,
        formData
      );
      setProfile(res.data); // update profile instantly
      setActiveTab("view"); // go back to view mode
    } catch (err) {
      console.error("❌ Update profile error:", err);
      alert("Failed to save profile. Check console/logs.");
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>
          Welcome, <span>{profile?.name || user?.name || "Contractor"}</span>
        </h1>
      </header>

      {/* Stats Section */}
      <div className="stats">
        <div className="stat-card">
          <h2>24</h2>
          <p>Projects Completed</p>
        </div>
        <div className="stat-card">
          <h2>$12,300</h2>
          <p>Total Earnings</p>
        </div>
        <div className="stat-card">
          <h2>4.9⭐</h2>
          <p>Client Rating</p>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle">
        <button
          className={activeTab === "view" ? "active" : ""}
          onClick={() => setActiveTab("view")}
        >
          👤 View Profile
        </button>
        <button
          className={activeTab === "update" ? "active" : ""}
          onClick={() => setActiveTab("update")}
        >
          ✏️ Update Profile
        </button>
      </div>

      {/* Content Section */}
      <div className="card">
        {activeTab === "view" ? (
          <div>
            <h2>Profile Overview</h2>
            <p><strong>Name:</strong> {profile?.name || "N/A"}</p>
            <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
            <p><strong>Phone:</strong> {profile?.phone || "N/A"}</p>
            <p><strong>Specialization:</strong> {profile?.specialization || "Painting Contractor"}</p>
            <p><strong>Availability:</strong> {profile?.availability || "Not specified"}</p>
            <p><strong>Location:</strong> {profile?.location || "Not specified"}</p>
            <p><strong>Bio:</strong> {profile?.bio || "No bio available"}</p>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <h2>Update Profile</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
            <input
              type="text"
              name="availability"
              placeholder="Availability (e.g. Mon–Sat, 9am–6pm)"
              value={formData.availability}
              onChange={handleChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location (City/Area)"
              value={formData.location}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Write a short bio..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;

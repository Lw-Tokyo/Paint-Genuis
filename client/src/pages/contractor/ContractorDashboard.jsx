// client/src/pages/contractor/ContractorDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import ContractorService from "../../services/ContractorService";
import MessagesPage from "../messages/MessagesPage";
import "./ContractorDashboard.css";

const ContractorDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("view");
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    services: "",
    availability: "Available",
    location: "",
    bio: "",
    experience: 0,
    hoursPerDay: 8,
    workSpeed: 40,
    hourlyRate: 0,
    website: "",
    profilePicture: "",
  });

  const getToken = () => user?.token || null;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userId = user._id || user.id;
        const data = await ContractorService.getContractorByUserId(userId, getToken());
        
        const profileData = data.success ? data.data : data;
        setProfile(profileData || null);

        if (profileData) {
          setFormData({
            companyName: profileData.companyName || "",
            email: profileData.email || user?.email || "",
            phone: profileData.phone || "",
            services: Array.isArray(profileData.services)
              ? profileData.services.join(", ")
              : profileData.services || "",
            availability: profileData.availability || "Available",
            location: profileData.location
              ? `${profileData.location.city || ""}${
                  profileData.location.state ? ", " + profileData.location.state : ""
                }`
              : "",
            bio: profileData.bio || "",
            experience: profileData.experience || 0,
            hoursPerDay: profileData.hoursPerDay || 8,
            workSpeed: profileData.workSpeed || 40,
            hourlyRate: profileData.hourlyRate || 0,
            website: profileData.website || "",
            profilePicture: profileData.profilePicture || "",
          });
        }
      } catch (err) {
        console.warn("❌ Fetch profile error:", err.response?.data || err.message || err);
        setProfile(null);
        setFormData((prev) => ({
          ...prev,
          email: user?.email || prev.email,
        }));
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value || "" }));
  };

  const parseLocation = (locStr) => {
    if (!locStr) return { city: "", state: "" };
    const parts = locStr
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    return { city: parts[0] || "", state: parts[1] || "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Please login to update your profile.");
      return;
    }

    const { city, state } = parseLocation(formData.location);

    if (!formData.companyName?.trim() || !city?.trim()) {
      setMessage("Company name and city are required.");
      return;
    }

    const payload = {
      companyName: formData.companyName.trim(),
      services: formData.services
        ? formData.services.split(",").map((s) => s.trim())
        : [],
      phone: formData.phone,
      location: { city: city.trim(), state: state?.trim() || "" },
      bio: formData.bio,
      availability: formData.availability,
      experience: parseInt(formData.experience) || 0,
      hoursPerDay: parseInt(formData.hoursPerDay) || 8,
      workSpeed: parseInt(formData.workSpeed) || 40,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      website: formData.website || "",
      profilePicture: formData.profilePicture || "",
    };

    try {
      let res;
      if (profile && profile._id) {
        res = await ContractorService.updateContractor(profile._id, payload, getToken());
      } else {
        res = await ContractorService.createContractor(payload, getToken());
      }

      const updatedProfile = res.success ? res.data : res;
      setProfile(updatedProfile);
      
      setFormData({
        companyName: updatedProfile.companyName || "",
        email: updatedProfile.email || user?.email || "",
        phone: updatedProfile.phone || "",
        services: Array.isArray(updatedProfile.services)
          ? updatedProfile.services.join(", ")
          : updatedProfile.services || "",
        availability: updatedProfile.availability || "Available",
        location: updatedProfile.location
          ? `${updatedProfile.location.city || ""}${
              updatedProfile.location.state ? ", " + updatedProfile.location.state : ""
            }`
          : "",
        bio: updatedProfile.bio || "",
        experience: updatedProfile.experience || 0,
        hoursPerDay: updatedProfile.hoursPerDay || 8,
        workSpeed: updatedProfile.workSpeed || 40,
        hourlyRate: updatedProfile.hourlyRate || 0,
        website: updatedProfile.website || "",
        profilePicture: updatedProfile.profilePicture || "",
      });

      setMessage("✅ Profile saved successfully!");
      setActiveTab("view");
    } catch (err) {
      console.error("❌ Update/Create profile error:", err.response?.data || err.message || err);
      setMessage("❌ Failed to save profile. Check console/logs.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This cannot be undone.")) {
      return;
    }

    try {
      if (profile && profile._id) {
        await ContractorService.deleteContractor(profile._id, getToken());
        setProfile(null);
        setMessage("✅ Profile deleted successfully!");
        setActiveTab("update");
      }
    } catch (err) {
      console.error("❌ Delete profile error:", err);
      setMessage("❌ Failed to delete profile.");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          Welcome, <span>{profile?.companyName || user?.name || "Contractor"}</span>
        </h1>
      </header>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h2>{profile?.experience || 0}</h2>
          <p>Years Experience</p>
        </div>
        <div className="stat-card">
          <h2>{profile?.rating?.toFixed(1) || "0.0"}⭐</h2>
          <p>Rating</p>
        </div>
        <div className="stat-card">
          <h2>{profile?.reviewCount || 0}</h2>
          <p>Reviews</p>
        </div>
      </div>

      {/* Tabs */}
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
        <button
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => setActiveTab("messages")}
        >
          💬 Messages
        </button>
        <button
          onClick={() => window.location.href = "/contractor/discounts"}
        >
          🎁 Discounts & offers
        </button>
      </div>

      {/* Content */}
      <div className="card">
        {message && <div className="message-box">{message}</div>}

        {activeTab === "view" ? (
          <div>
            <h2>Profile Overview</h2>
            <div className="profile-grid">
              <div className="profile-item">
                <strong>Company Name:</strong>
                <span>{profile?.companyName || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Email:</strong>
                <span>{profile?.email || user?.email || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Phone:</strong>
                <span>{profile?.phone || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Services:</strong>
                <span>
                  {Array.isArray(profile?.services)
                    ? profile.services.join(", ")
                    : profile?.services || "Not specified"}
                </span>
              </div>
              <div className="profile-item">
                <strong>Availability:</strong>
                <span>{profile?.availability || "Not specified"}</span>
              </div>
              <div className="profile-item">
                <strong>Location:</strong>
                <span>
                  {profile?.location
                    ? `${profile.location.city || ""}${
                        profile.location.state ? ", " + profile.location.state : ""
                      }`
                    : "Not specified"}
                </span>
              </div>
              <div className="profile-item">
                <strong>Experience:</strong>
                <span>{profile?.experience || 0} years</span>
              </div>
              <div className="profile-item">
                <strong>Working Hours:</strong>
                <span>{profile?.hoursPerDay || 8} hours/day</span>
              </div>
              <div className="profile-item">
                <strong>Work Speed:</strong>
                <span>{profile?.workSpeed || 40} sq ft/hour</span>
              </div>
              <div className="profile-item">
                <strong>Hourly Rate:</strong>
                <span>${profile?.hourlyRate || 0}/hour</span>
              </div>
              <div className="profile-item full-width">
                <strong>Bio:</strong>
                <span>{profile?.bio || "No bio available"}</span>
              </div>
            </div>
            
            {profile && (
              <button onClick={handleDelete} className="delete-btn">
                🗑️ Delete Profile
              </button>
            )}
          </div>
        ) : activeTab === "update" ? (
          <form className="form" onSubmit={handleSubmit}>
            <h2>{profile ? "Update Profile" : "Create Profile"}</h2>
            
            <input
              type="text"
              name="companyName"
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
            
            <input
              type="text"
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
            <input
              type="text"
              name="services"
              placeholder="Services (comma-separated) *"
              value={formData.services}
              onChange={handleChange}
              required
            />
            
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Unavailable">Unavailable</option>
            </select>
            
            <input
              type="text"
              name="location"
              placeholder="Location (City, State) *"
              value={formData.location}
              onChange={handleChange}
              required
            />
            
            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              max="50"
            />
            
            <input
              type="number"
              name="hoursPerDay"
              placeholder="Working Hours Per Day (4-12)"
              value={formData.hoursPerDay}
              onChange={handleChange}
              min="4"
              max="12"
            />
            
            <input
              type="number"
              name="workSpeed"
              placeholder="Work Speed (sq ft/hour, 20-80)"
              value={formData.workSpeed}
              onChange={handleChange}
              min="20"
              max="80"
            />
            
            <input
              type="number"
              name="hourlyRate"
              placeholder="Hourly Rate ($)"
              value={formData.hourlyRate}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            
            <input
              type="url"
              name="website"
              placeholder="Website URL"
              value={formData.website}
              onChange={handleChange}
            />
            
            <input
              type="url"
              name="profilePicture"
              placeholder="Profile Picture URL"
              value={formData.profilePicture}
              onChange={handleChange}
            />
            
            <textarea
              name="bio"
              placeholder="Write a short bio..."
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            ></textarea>
            
            <button type="submit" className="save-btn">
              {profile ? "💾 Save Changes" : "✨ Create Profile"}
            </button>
          </form>
        ) : (
          <MessagesPage />
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
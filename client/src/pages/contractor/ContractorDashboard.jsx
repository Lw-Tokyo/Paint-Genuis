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

  const handleSubmit = async () => {
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
    <div className="contractor-dashboard-wrapper">
      <div className="contractor-content">
        {/* Page Header */}
        <header className="contractor-page-header contractor-slide-in-down">
          <div>
            <h1 className="contractor-page-title">
              Welcome Back, <span className="contractor-gradient-text">{profile?.companyName || user?.name || "Contractor"}</span>
            </h1>
            <p className="contractor-page-subtitle">Manage your contractor profile and view your performance</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="contractor-stats-grid">
          <div className="contractor-stat-card contractor-slide-in-up-delay-1">
            <div className="contractor-stat-icon-wrapper">
              <span className="contractor-stat-icon">📅</span>
            </div>
            <h2 className="contractor-stat-value">{profile?.experience || 0}</h2>
            <p className="contractor-stat-label">Years Experience</p>
            <div className="contractor-stat-shine"></div>
          </div>
          
          <div className="contractor-stat-card contractor-slide-in-up-delay-2">
            <div className="contractor-stat-icon-wrapper">
              <span className="contractor-stat-icon">⭐</span>
            </div>
            <h2 className="contractor-stat-value">{profile?.rating?.toFixed(1) || "0.0"}</h2>
            <p className="contractor-stat-label">Rating</p>
            <div className="contractor-stat-shine"></div>
          </div>
          
          <div className="contractor-stat-card contractor-slide-in-up-delay-3">
            <div className="contractor-stat-icon-wrapper">
              <span className="contractor-stat-icon">💬</span>
            </div>
            <h2 className="contractor-stat-value">{profile?.reviewCount || 0}</h2>
            <p className="contractor-stat-label">Reviews</p>
            <div className="contractor-stat-shine"></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="contractor-tab-container contractor-slide-in-up-delay-4">
          <button
            className={`contractor-tab-button ${activeTab === "view" ? "contractor-tab-button-active" : ""}`}
            onClick={() => setActiveTab("view")}
          >
            <span className="contractor-tab-icon">👤</span>
            View Profile
          </button>
          <button
            className={`contractor-tab-button ${activeTab === "update" ? "contractor-tab-button-active" : ""}`}
            onClick={() => setActiveTab("update")}
          >
            <span className="contractor-tab-icon">✏️</span>
            Update Profile
          </button>
          <button
            className={`contractor-tab-button ${activeTab === "messages" ? "contractor-tab-button-active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            <span className="contractor-tab-icon">💬</span>
            Messages
          </button>
          <button
            className="contractor-tab-button"
            onClick={() => window.location.href = "/contractor/discounts"}
          >
            <span className="contractor-tab-icon">🎁</span>
            Discounts & Offers
          </button>
        </div>

        {/* Main Content Card */}
        <div className="contractor-glass-card contractor-slide-in-up-delay-5">
          {message && (
            <div className={`contractor-message-box ${message.includes("✅") ? "contractor-message-success" : "contractor-message-error"}`}>
              {message}
            </div>
          )}

          {activeTab === "view" ? (
            <div>
              <h2 className="contractor-card-title">
                <span className="contractor-gradient-text">Profile Overview</span>
              </h2>
              
              <div className="contractor-profile-grid">
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Company Name</strong>
                  <span className="contractor-profile-value">{profile?.companyName || "N/A"}</span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Email</strong>
                  <span className="contractor-profile-value">{profile?.email || user?.email || "N/A"}</span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Phone</strong>
                  <span className="contractor-profile-value">{profile?.phone || "N/A"}</span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Services</strong>
                  <span className="contractor-profile-value">
                    {Array.isArray(profile?.services)
                      ? profile.services.join(", ")
                      : profile?.services || "Not specified"}
                  </span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Availability</strong>
                  <span className="contractor-profile-value">{profile?.availability || "Not specified"}</span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Location</strong>
                  <span className="contractor-profile-value">
                    {profile?.location
                      ? `${profile.location.city || ""}${
                          profile.location.state ? ", " + profile.location.state : ""
                        }`
                      : "Not specified"}
                  </span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Experience</strong>
                  <span className="contractor-profile-value contractor-gradient-text">
                    {profile?.experience || 0} years
                  </span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Working Hours</strong>
                  <span className="contractor-profile-value">{profile?.hoursPerDay || 8} hours/day</span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Work Speed</strong>
                  <span className="contractor-profile-value">{profile?.workSpeed || 40} sq ft/hour</span>
                </div>
                
                <div className="contractor-profile-item">
                  <strong className="contractor-profile-label">Hourly Rate</strong>
                  <span className="contractor-profile-value contractor-gradient-text contractor-hourly-rate">
                    ${profile?.hourlyRate || 0}/hour
                  </span>
                </div>
                
                <div className="contractor-profile-item contractor-profile-item-full">
                  <strong className="contractor-profile-label">Bio</strong>
                  <span className="contractor-profile-value">{profile?.bio || "No bio available"}</span>
                </div>
              </div>
              
              {profile && (
                <button onClick={handleDelete} className="contractor-delete-button">
                  🗑️ Delete Profile
                </button>
              )}
            </div>
          ) : activeTab === "update" ? (
            <div className="contractor-form">
              <h2 className="contractor-card-title">
                <span className="contractor-gradient-text">
                  {profile ? "Update Profile" : "Create Profile"}
                </span>
              </h2>
              
              <input
                type="text"
                name="companyName"
                placeholder="Company Name *"
                value={formData.companyName}
                onChange={handleChange}
                className="contractor-input"
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="contractor-input contractor-input-disabled"
                disabled
              />
              
              <input
                type="text"
                name="phone"
                placeholder="Phone *"
                value={formData.phone}
                onChange={handleChange}
                className="contractor-input"
              />
              
              <input
                type="text"
                name="services"
                placeholder="Services (comma-separated) *"
                value={formData.services}
                onChange={handleChange}
                className="contractor-input"
              />
              
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="contractor-input"
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
                className="contractor-input"
              />
              
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleChange}
                className="contractor-input"
                min="0"
                max="50"
              />
              
              <input
                type="number"
                name="hoursPerDay"
                placeholder="Working Hours Per Day (4-12)"
                value={formData.hoursPerDay}
                onChange={handleChange}
                className="contractor-input"
                min="4"
                max="12"
              />
              
              <input
                type="number"
                name="workSpeed"
                placeholder="Work Speed (sq ft/hour, 20-80)"
                value={formData.workSpeed}
                onChange={handleChange}
                className="contractor-input"
                min="20"
                max="80"
              />
              
              <input
                type="number"
                name="hourlyRate"
                placeholder="Hourly Rate ($)"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="contractor-input"
                min="0"
                step="0.01"
              />
              
              <input
                type="url"
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
                className="contractor-input"
              />
              
              <input
                type="url"
                name="profilePicture"
                placeholder="Profile Picture URL"
                value={formData.profilePicture}
                onChange={handleChange}
                className="contractor-input"
              />
              
              <textarea
                name="bio"
                placeholder="Write a short bio..."
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="contractor-input contractor-textarea"
              />
              
              <button onClick={handleSubmit} className="contractor-primary-button">
                {profile ? "💾 Save Changes" : "✨ Create Profile"}
              </button>
            </div>
          ) : (
            <MessagesPage />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
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
    availability: "",
    location: "",
    bio: "",
  });

  const getToken = () => user?.token || null;

  // Load contractor profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userId = user._id || user.id;
        const data = await ContractorService.getContractorByUserId(
          userId,
          getToken()
        );
        setProfile(data || null);

        setFormData({
          companyName: data?.companyName || "",
          email: data?.user?.email || user?.email || "",
          phone: data?.phone || "",
          services: Array.isArray(data?.services)
            ? data.services.join(", ")
            : data?.services || "",
          availability: data?.availability || "",
          location: data?.location
            ? `${data.location.city || ""}${
                data.location.state ? ", " + data.location.state : ""
              }`
            : "",
          bio: data?.bio || "",
        });
      } catch (err) {
        console.warn(
          "❌ Fetch profile error:",
          err.response?.data || err.message || err
        );
        setProfile(null);
        setFormData((prev) => ({
          ...prev,
          email: user?.email || prev.email,
        }));
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    };

    try {
      let res;
      if (profile && profile._id) {
        res = await ContractorService.updateContractor(
          profile._id,
          payload,
          getToken()
        );
      } else {
        res = await ContractorService.createContractor(payload, getToken());
      }

      setProfile(res);
      setFormData({
        companyName: res.companyName || "",
        email: res.user?.email || user?.email || "",
        phone: res.phone || "",
        services: Array.isArray(res?.services)
          ? res.services.join(", ")
          : res?.services || "",
        availability: res.availability || "",
        location: res.location
          ? `${res.location.city || ""}${
              res.location.state ? ", " + res.location.state : ""
            }`
          : "",
        bio: res.bio || "",
      });

      setMessage("✅ Profile saved successfully!");
      setActiveTab("view");
    } catch (err) {
      console.error(
        "❌ Update/Create profile error:",
        err.response?.data || err.message || err
      );
      setMessage("❌ Failed to save profile. Check console/logs.");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          Welcome,{" "}
          <span>
            {profile?.companyName || user?.name || "Contractor"}
          </span>
        </h1>
      </header>

      {/* Stats */}
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
      </div>

      {/* Content */}
      <div className="card">
        {message && <div style={{ marginBottom: 12 }}>{message}</div>}

        {activeTab === "view" ? (
          <div>
            <h2>Profile Overview</h2>
            <p>
              <strong>Company Name:</strong>{" "}
              {profile?.companyName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {profile?.user?.email || user?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {profile?.phone || "N/A"}
            </p>
            <p>
              <strong>Services:</strong>{" "}
              {Array.isArray(profile?.services)
                ? profile.services.join(", ")
                : profile?.services || "Not specified"}
            </p>
            <p>
              <strong>Availability:</strong>{" "}
              {profile?.availability || "Not specified"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {profile?.location
                ? `${profile.location.city || ""}${
                    profile.location.state
                      ? ", " + profile.location.state
                      : ""
                  }`
                : "Not specified"}
            </p>
            <p>
              <strong>Bio:</strong>{" "}
              {profile?.bio || "No bio available"}
            </p>
          </div>
        ) : activeTab === "update" ? (
          <form className="form" onSubmit={handleSubmit}>
            <h2>Update Profile</h2>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
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
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="services"
              placeholder="Services (comma-separated)"
              value={formData.services}
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
              placeholder="Location (City, State)"
              value={formData.location}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Write a short bio..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
            <button type="submit" className="save-btn">
              Save Changes
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

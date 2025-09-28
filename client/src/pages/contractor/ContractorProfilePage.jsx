import React, { useState, useEffect, useContext } from "react";
import ContractorService from "../../services/ContractorService";
import { UserContext } from "../../context/UserContext";

function ContractorProfilePage() {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
    location: "",
    availability: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !user.token) return;
        const data = await ContractorService.getProfile(user.id, user.token);
        if (data) {
          setProfile(data);
          setFormData({
            name: data.name || "",
            specialization: data.specialization || "",
            experience: data.experience || "",
            location: data.location || "",
            availability: data.availability || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user || !user.token) return;
      if (profile) {
        // Update existing profile
        const updated = await ContractorService.updateProfile(formData, user.token);
        setProfile(updated);
      } else {
        // Create new profile
        const created = await ContractorService.createProfile(formData, user.token);
        setProfile(created);
      }
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  // Delete profile
  const handleDelete = async () => {
    try {
      if (!user || !user.token) return;
      await ContractorService.deleteProfile(user.token);
      setProfile(null);
      setFormData({
        name: "",
        specialization: "",
        experience: "",
        location: "",
        availability: "",
      });
      alert("Profile deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Contractor Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
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
          name="experience"
          placeholder="Experience (years)"
          value={formData.experience}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="availability"
          placeholder="Availability"
          value={formData.availability}
          onChange={handleChange}
        />
        <button type="submit">{profile ? "Update" : "Create"} Profile</button>
      </form>

      {profile && (
        <div>
          <h3>Current Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Experience:</strong> {profile.experience} years</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Availability:</strong> {profile.availability}</p>
          <button onClick={handleDelete}>Delete Profile</button>
        </div>
      )}
    </div>
  );
}

export default ContractorProfilePage;

import React, { useState } from "react";
import axios from "../../services/api";

function ContractorForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    services: "",
    city: "",
    state: "",
    availability: "",
    experienceYears: "",
    contactNumber: "",
    bio: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/contractors", {
        ...formData,
        services: formData.services.split(","),
        location: { city: formData.city, state: formData.state }
      });
      alert("Profile saved!");
    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="companyName" placeholder="Company Name" onChange={handleChange} />
      <input name="services" placeholder="Services (comma separated)" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="availability" placeholder="Availability" onChange={handleChange} />
      <input name="experienceYears" placeholder="Years of Experience" onChange={handleChange} />
      <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
      <textarea name="bio" placeholder="Bio" onChange={handleChange}></textarea>
      <button type="submit">Save Profile</button>
    </form>
  );
}

export default ContractorForm;

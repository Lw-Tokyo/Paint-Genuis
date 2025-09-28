import React from "react";
import "./ContractorCard.css"; // optional styling

function ContractorCard({ contractor }) {
  return (
    <div className="contractor-card">
      <h3>{contractor.name}</h3>
      <p><strong>Location:</strong> {contractor.location}</p>
      <p><strong>Services:</strong> {contractor.services}</p>
      <p><strong>Experience:</strong> {contractor.experience} years</p>
      <p><strong>Contact:</strong> {contractor.contactInfo}</p>
      <button className="contact-btn">Contact</button>
    </div>
  );
}

export default ContractorCard;

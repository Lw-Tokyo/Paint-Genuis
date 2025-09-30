// client/src/components/contractors/ContractorCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ContractorCard.css";

function ContractorCard({ contractor }) {
  const services = Array.isArray(contractor.services)
    ? contractor.services.join(", ")
    : contractor.services || "—";

  // ✅ Fix: Support both string and object location
  const location =
    typeof contractor.location === "string"
      ? contractor.location
      : contractor.location
      ? `${contractor.location.city || ""}${
          contractor.location.state ? ", " + contractor.location.state : ""
        }`
      : "—";

  const bioPreview =
    contractor.bio && contractor.bio.length > 80
      ? contractor.bio.substring(0, 80) + "..."
      : contractor.bio || "No bio provided.";

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          {contractor.companyName || "Unnamed Contractor"}
        </h5>
        <p className="mb-1">
          <strong>Location:</strong> {location}
        </p>
        <p className="mb-1">
          <strong>Services:</strong> {services}
        </p>
        <p className="mb-1">
          <strong>Experience:</strong> {contractor.experience ?? "—"} years
        </p>
        <p className="mb-1">
          <strong>Availability:</strong> {contractor.availability ?? "—"}
        </p>
        <p className="mb-2 text-muted">
          <em>{bioPreview}</em>
        </p>

        <div className="mt-auto d-flex gap-2">
          {/* Public contractor profile */}
          <Link
            to={`/contractors/${contractor._id}`}
            className="btn btn-outline-primary btn-sm"
          >
            View
          </Link>

          {/* Direct call link if phone exists */}
          {contractor.phone && (
            <a
              href={`tel:${contractor.phone}`}
              className="btn btn-success btn-sm"
            >
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractorCard;

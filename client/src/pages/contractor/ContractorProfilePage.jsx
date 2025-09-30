// client/src/pages/contractor/ContractorProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContractorService from "../../services/ContractorService";

function ContractorProfilePage() {
  const { id } = useParams(); // contractor._id from route
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await ContractorService.getContractorById(id); // ✅ using correct method
        setContractor(res);
      } catch (err) {
        console.error("Error loading contractor:", err);
        setError("Failed to load contractor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [id]);

  if (loading) return <div className="container py-4">Loading profile...</div>;
  if (error) return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!contractor) return <div className="container py-4">Contractor not found.</div>;

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

  return (
    <div className="container py-4">
      <h2>{contractor.companyName || "Unnamed Contractor"}</h2>
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Services:</strong> {services}
      </p>
      <p>
        <strong>Experience:</strong> {contractor.experience ?? "—"} years
      </p>
      <p>
        <strong>Availability:</strong> {contractor.availability ?? "—"}
      </p>
      <p>
        <strong>Phone:</strong> {contractor.phone ?? "—"}
      </p>
      <p>
        <strong>Bio:</strong>
      </p>
      <p>{contractor.bio || "No bio provided."}</p>

      <div className="mt-3">
        {contractor.phone && (
          <a href={`tel:${contractor.phone}`} className="btn btn-success me-2">
            Call Contractor
          </a>
        )}
        {/* later we can add "Hire" or "Message" here */}
      </div>
    </div>
  );
}

export default ContractorProfilePage;

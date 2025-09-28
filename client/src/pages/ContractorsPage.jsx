import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ContractorCard from "../components/contractors/ContractorCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ContractorsPage.css";

function ContractorsPage() {
  const [contractors, setContractors] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: "", services: "" });

  const fetchContractors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/contractors", {
        params: { city: filters.location || undefined, service: filters.services || undefined, page, limit: meta.limit },
      });

      if (res.data.items && Array.isArray(res.data.items)) {
        setContractors(res.data.items);
        setMeta((m) => ({ ...m, page: res.data.meta.page, pages: res.data.meta.pages, total: res.data.meta.total }));
      } else if (Array.isArray(res.data)) {
        setContractors(res.data);
        setMeta((m) => ({ ...m, total: res.data.length, pages: 1, page }));
      } else {
        // fallback
        setContractors(res.data.items || []);
      }
    } catch (err) {
      console.error("Fetch contractors error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, meta.limit]);

  useEffect(() => {
    fetchContractors(1);
  }, [fetchContractors]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContractors(1);
  };

  const goPage = (p) => {
    if (p < 1 || p > (meta.pages || 1)) return;
    fetchContractors(p);
  };

  return (
    <div className="contractors-page">
      <h1>Find Contractors</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input placeholder="City" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <input placeholder="Service" value={filters.services} onChange={(e) => setFilters({ ...filters, services: e.target.value })} />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="contractor-list">
          {Array(6).fill().map((_, i) => (
            <div key={i} className="contractor-card">
              <h3><Skeleton width={160} /></h3>
              <p><Skeleton width={220} /></p>
              <p><Skeleton width={180} /></p>
              <Skeleton height={36} width={100} style={{ borderRadius: 10, marginTop: 8 }} />
            </div>
          ))}
        </div>
      ) : contractors.length === 0 ? (
        <p>No contractors found.</p>
      ) : (
        <>
          <div className="contractor-list">
            {contractors.map((c) => (
              <div key={c._id || c.id}>
                <ContractorCard contractor={{
                  companyName: c.companyName,
                  services: Array.isArray(c.services) ? c.services.join(", ") : c.services,
                  location: c.location?.city || "",
                  experience: c.experienceYears,
                  contactNumber: c.contactNumber,
                  _id: c._id || c.id,
                }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {c.contactNumber ? (
                    <a href={`tel:${c.contactNumber}`}>
                      <button>Call</button>
                    </a>
                  ) : null}
                  <a href={`/contractors/${c._id || c.id}`}>
                    <button>View</button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta.pages > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
              <button onClick={() => goPage(meta.page - 1)} disabled={meta.page <= 1}>Prev</button>
              <span>Page {meta.page} / {meta.pages}</span>
              <button onClick={() => goPage(meta.page + 1)} disabled={meta.page >= meta.pages}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ContractorsPage;

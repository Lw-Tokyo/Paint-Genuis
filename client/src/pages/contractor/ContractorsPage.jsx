// client/src/pages/ContractorsPage.jsx
import React, { useEffect, useState } from "react";
import ContractorService from "../services/ContractorService";
import ContractorCard from "../components/contractors/ContractorCard";

function ContractorsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const q = [];
      if (query) q.push(`q=${encodeURIComponent(query)}`);
      if (city) q.push(`city=${encodeURIComponent(city)}`);
      if (service) q.push(`service=${encodeURIComponent(service)}`);
      q.push(`page=${page}`);
      q.push(`limit=${meta.limit || 12}`);
      const qs = q.length ? "?" + q.join("&") : "";
      const res = await ContractorService.searchContractors(qs);
      // backend returns { items, meta }
      if (res && res.items) {
        setItems(res.items);
        setMeta(res.meta || { page, limit: 12, pages: 1, total: res.items.length });
      } else if (Array.isArray(res)) {
        setItems(res);
        setMeta({ page: 1, limit: res.length, pages: 1, total: res.length });
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load contractors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(1);
  };

  const goPage = (p) => {
    fetch(p);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Find Contractors</h2>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Search (name, bio, services...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Service (e.g. Painting)"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" type="submit">Search</button>
        </div>
      </form>

      {loading ? (
        <p>Loading contractors...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : items.length === 0 ? (
        <p>No contractors found.</p>
      ) : (
        <>
          <div className="row">
            {items.map((c) => (
              <div key={c._id} className="col-md-4 mb-3">
                <ContractorCard contractor={c} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta.pages > 1 && (
            <nav aria-label="Contractor pages">
              <ul className="pagination">
                {Array.from({ length: meta.pages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <li key={p} className={`page-item ${meta.page === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => goPage(p)}>
                        {p}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default ContractorsPage;

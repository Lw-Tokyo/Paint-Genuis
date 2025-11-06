// client/src/pages/ContractorsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import ContractorService from "../services/ContractorService";
import ContractorCard from "../components/contractors/ContractorCard";
import "./ContractorsPage.css";

function ServiceDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef(null);

  const presetOptions = ["Painter", "Designer"];

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputClick = () => {
    console.log('Input clicked, opening dropdown');
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    console.log('Input focused, opening dropdown');
    setIsOpen(true);
  };

  return (
    <div className="service-dropdown" ref={dropdownRef}>
      <input
        className="service-input"
        placeholder="Select or type service..."
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onClick={handleInputClick}
      />
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">Recommended Services</div>
          {presetOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              className="dropdown-item"
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContractorsPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // In ContractorsPage.jsx - Update the fetch function

const fetch = async (page = 1) => {
  setLoading(true);
  setError("");
  try {
    const params = [];
    if (query) params.push(`q=${encodeURIComponent(query)}`);
    if (city) params.push(`city=${encodeURIComponent(city)}`);
    if (service) params.push(`service=${encodeURIComponent(service)}`);
    params.push(`page=${page}`);
    params.push(`limit=${meta.limit || 12}`);
    
    const queryString = params.length ? "?" + params.join("&") : "";
    
    // USE searchContractors with query string
    const res = await ContractorService.searchContractors(queryString);
    
    if (res.success && res.data) {
      setItems(res.data);
      setMeta({
        page: res.page || 1,
        limit: 12,
        pages: res.pages || 1,
        total: res.total || res.data.length
      });
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
    <div className="contractors-page-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-bg-animation">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Find Contractors</h1>
          <p className="hero-subtitle">
            Connect with elite professionals for your dream project
          </p>

          {/* Search Form */}
          <form className="search-form-luxury" onSubmit={handleSearch}>
            <div className="search-form-card">
              <div className="search-grid">
                <div className="search-input-wrapper search-input-wide">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    className="search-input"
                    placeholder="Search contractors, services, company..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                
                <div className="search-input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <input
                    className="search-input"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                
                <div className="search-input-wrapper">
                  <svg className="input-icon input-icon-absolute" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <div style={{ paddingLeft: '2.5rem' }}>
                    <ServiceDropdown value={service} onChange={setService} />
                  </div>
                </div>
              </div>
              
              <button className="search-button-luxury" type="submit">
                Search Contractors
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring spinner-ring-animated"></div>
            </div>
            <p className="loading-text">Finding the best contractors for you...</p>
          </div>
        ) : error ? (
          <div className="error-card">
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-card">
            <p className="empty-title">No contractors found</p>
            <p className="empty-subtitle">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h2 className="results-title">
                {meta.total} Contractors Available
              </h2>
              <p className="results-subtitle">
                Handpicked professionals ready to bring your vision to life
              </p>
            </div>

            <div className="contractor-grid">
              {items.map((c, idx) => (
                <div 
                  key={c._id} 
                  className="contractor-grid-item"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ContractorCard contractor={c} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="pagination-container">
                {Array.from({ length: meta.pages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      className={`pagination-button ${meta.page === p ? "pagination-button-active" : ""}`}
                      onClick={() => goPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ContractorsPage;
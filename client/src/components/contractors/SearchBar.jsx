import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");
  const [service, setService] = useState("");

  const handleSearch = () => onSearch({ city, service });

  return (
    <div className="search-bar">
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <input placeholder="Service" value={service} onChange={(e) => setService(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;

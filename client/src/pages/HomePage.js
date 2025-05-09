import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="text-center">
      <h1 className="mb-4">Welcome to Paint Genius!</h1>
      <p className="lead">Your smart solution for estimating painting costs easily.</p>
      <Link to="/estimate" className="btn btn-primary mt-3">Get a Cost Estimate</Link>
    </div>
  );
}

export default HomePage;


import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center animate-fade-in">
        <div className="bg-ey-yellow h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-ey-darkGray">404</span>
        </div>
        <h1 className="text-3xl font-bold text-ey-darkGray mb-4">Page Not Found</h1>
        <p className="text-ey-lightGray mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <button className="ey-button flex items-center mx-auto">
            <Home className="h-5 w-5 mr-2" />
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

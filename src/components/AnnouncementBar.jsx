import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AnnouncementBar = ({ message, link, linkText }) => {
  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <span>{message || "Special Promotion: Get 20% off on all products!"}</span>
        {link && (
          <Link 
            to={link} 
            className="flex items-center gap-1 hover:text-green-400 transition-colors underline"
          >
            {linkText || "Shop Now"}
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;


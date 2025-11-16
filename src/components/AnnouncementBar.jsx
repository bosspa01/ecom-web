import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const AnnouncementBar = ({ message, link, linkText }) => {
  return (
    <div className="bg-gray-900 text-white py-2 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm flex-wrap">
        <span className="flex-shrink-0">{message || "Special Promotion: Get 20% off on all products!"}</span>
        {link && (
          <Link 
            to={link} 
            className="flex items-center gap-0.5 hover:text-green-400 transition-colors underline flex-shrink-0"
          >
            {linkText || "Shop Now"}
            <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;


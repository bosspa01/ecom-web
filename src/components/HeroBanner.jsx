import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroBanner = ({ 
  title, 
  subtitle, 
  description, 
  ctaText, 
  ctaLink, 
  badge,
  backgroundImage,
  gradient = "from-red-900 via-orange-800 to-red-700"
}) => {
  return (
    <div 
      className={`relative w-full min-h-[45vh] sm:min-h-[55vh] md:min-h-[65vh] lg:min-h-[75vh] bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {badge && (
          <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded mb-4 text-sm font-semibold">
            {badge}
          </div>
        )}
        
        {title && (
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
        )}
        
        {subtitle && (
          <h2 className="text-lg sm:text-2xl md:text-3xl text-white mb-4">
            {subtitle}
          </h2>
        )}
        
        {description && (
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        {ctaLink && (
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {ctaText || "Shop Now"}
            <ArrowRight size={20} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;


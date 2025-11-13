import React from "react";
import useTranslation from "../hooks/useTranslation";
import AnnouncementBar from "../components/AnnouncementBar";
import HeroBanner from "../components/HeroBanner";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryShowcase from "../components/CategoryShowcase";
import NewsletterSignup from "../components/NewsletterSignup";

const Home = () => {
  const t = useTranslation();
  
  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <AnnouncementBar 
        message={t.special_promotion}
        link="/shop"
        linkText={t.shop_now}
      />

      {/* Hero Banner */}
      <HeroBanner
        badge={t.new_collection}
        title={t.discover_products}
        subtitle={t.premium_quality}
        description={t.home_description}
        ctaText={t.shop_now}
        ctaLink="/shop"
        gradient="from-gray-900 via-gray-800 to-gray-900"
      />

      {/* Featured Products Section */}
      <FeaturedProducts 
        title={t.featured_products}
        limit={8}
        showViewAll={true}
      />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Additional Hero Section - Optional */}
      <HeroBanner
        title={t.enter_code}
        subtitle={t.up_to_50_off}
        description={t.sale_description}
        ctaText={t.explore_sale}
        ctaLink="/shop"
        gradient="from-red-900 via-orange-800 to-red-700"
      />

      {/* New Arrivals Section */}
      <FeaturedProducts 
        title={t.new_arrivals}
        limit={4}
        showViewAll={true}
      />
    </div>
  );
};

export default Home;

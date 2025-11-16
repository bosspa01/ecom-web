import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./card/ProductCard";
import useEcomStore from "../store/ecom-store";
import useTranslation from "../hooks/useTranslation";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = ({ title = "Featured Products", limit = 8, showViewAll = true }) => {
  const t = useTranslation();
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  useEffect(() => {
    getProduct(limit);
  }, [limit]);

  const featuredProducts = products.slice(0, limit);

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          {showViewAll && (
            <Link
              to="/shop"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              {t.view_all}
              <ArrowRight size={20} />
            </Link>
          )}
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((item, index) => (
              <ProductCard item={item} key={item.id || index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t.no_products_available}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;


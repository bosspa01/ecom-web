import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import useTranslation from "../hooks/useTranslation";
import { ArrowRight } from "lucide-react";

const CategoryShowcase = () => {
  const t = useTranslation();
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  useEffect(() => {
    getCategory();
  }, []);

  // Default categories if none exist
  const defaultCategories = [
    { id: 1, name: "Electronics", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400" },
    { id: 2, name: "Fashion", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" },
    { id: 3, name: "Home & Living", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
    { id: 4, name: "Sports", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t.shop_by_category}</h2>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            {t.view_all_categories}
            <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative overflow-hidden rounded-lg aspect-square bg-gray-200 hover:shadow-xl transition-all transform hover:scale-105"
            >
              {category.image || category.images?.[0]?.url ? (
                <img
                  src={category.image || category.images?.[0]?.url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-2xl font-bold">{category.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg md:text-xl">{category.name}</h3>
                <div className="flex items-center gap-1 text-white mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm">{t.explore}</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;


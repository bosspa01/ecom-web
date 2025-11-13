import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import ProductCard from "./card/ProductCard";

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters);
  const products = useEcomStore((state) => state.products);
  const getProduct = useEcomStore((state) => state.getProduct);

  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Load initial products if search is empty
      if (!searchQuery.trim()) {
        getProduct(10);
      }
    } else {
      // Reset search when modal closes
      setSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delay = setTimeout(() => {
        actionSearchFilters({ query: searchQuery });
      }, 300);
      return () => clearTimeout(delay);
    } else {
      getProduct(10);
    }
  }, [searchQuery]);

  const handleProductClick = (product) => {
    onClose();
    navigate("/shop");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div
        className="relative w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {searchQuery.trim() ? (
            products.length > 0 ? (
              <div>
                <p className="text-gray-400 text-sm mb-4">
                  Found {products.length} result{products.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="cursor-pointer"
                    >
                      <ProductCard item={product} />
                    </div>
                  ))}
                </div>
                {products.length > 6 && (
                  <button
                    onClick={() => {
                      navigate("/shop");
                      onClose();
                    }}
                    className="w-full mt-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    View All Results
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No products found</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-400">Start typing to search for products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;


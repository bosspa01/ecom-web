import React, { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import ProductQuickView from "../ProductQuickView";
import useTranslation from "../../hooks/useTranslation";
import { numberFormat } from "../../utils/number";

const ProductCard = ({ item }) => {
  const t = useTranslation();
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className="border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group relative">
        <div className="relative overflow-hidden aspect-square">
          {item.images && item.images.length > 0 ? (
            <img 
              src={item.images[0].url} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer" 
              onClick={() => setIsQuickViewOpen(true)}
            />
          ) : (
            <div 
              className="w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={() => setIsQuickViewOpen(true)}
            >
              <span className="text-gray-400 text-sm">{t.no_image}</span>
            </div>
          )}
          
          {/* Quick View Button */}
          <button
            onClick={() => setIsQuickViewOpen(true)}
            className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-900 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            title={t.quick_view}
          >
            <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <h3 
            className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-green-600 transition-colors"
            onClick={() => setIsQuickViewOpen(true)}
          >
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2">{item.description}</p>
          <div className="flex justify-between items-center gap-2">
            <span className="text-base sm:text-xl font-bold text-gray-900">{numberFormat(item.price?.toFixed(2)) || numberFormat(item.price)}&nbsp;฿</span>
            <button 
              onClick={() => actionAddtoCart(item)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-md transition-colors flex-shrink-0"
              title={t.add_to_cart}
            >
              <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <ProductQuickView 
        product={item} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;

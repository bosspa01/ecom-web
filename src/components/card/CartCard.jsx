import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import useTranslation from "../../hooks/useTranslation";
import { Link } from "react-router-dom";
import { numberFormat } from "../../utils/number";

const CartCard = () => {
  const t = useTranslation();
  const carts = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore(
    (state) => state.actionUpdateQuantity
  );
  const actionRemoveProduct = useEcomStore(
    (state) => state.actionRemoveProduct
  );
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);
  console.log(carts);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-white">{t.shopping_cart}</h1>

      <div className="space-y-3">
        {carts.length > 0 ? (
          <>
            {carts.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 sm:p-3 rounded-lg shadow-md border border-gray-600">
                <div className="flex justify-between mb-2 gap-2">
                  <div className="flex gap-2 items-start flex-1 min-w-0">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-md flex-shrink-0"
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-600 rounded-md flex text-center items-center text-gray-400 text-xs flex-shrink-0">
                        {t.no_image}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-xs sm:text-sm line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => actionRemoveProduct(item.id)}
                    className="text-red-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                    title={t.remove}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="rounded-lg px-1.5 py-0.5 flex items-center gap-1 bg-gray-600 text-sm">
                    <button
                      onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                      className="px-1.5 py-0.5 bg-gray-500 hover:bg-gray-400 rounded text-white transition-colors text-xs"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-2 text-white font-medium text-xs">{numberFormat(item.count)}</span>
                    <button
                      onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                      className="px-1.5 py-0.5 bg-gray-500 hover:bg-gray-400 rounded text-white transition-colors text-xs"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="font-bold text-green-400 text-xs sm:text-sm">{numberFormat(item.price * item.count)}&nbsp;฿</div>
                </div>
              </div>
            ))}
            <div className="bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-600 mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-semibold text-sm">{t.total}:</span>
                <span className="text-lg sm:text-xl font-bold text-green-400">{numberFormat(getTotalPrice())}&nbsp;฿</span>
              </div>
              <Link to="/cart">
                <button className="bg-green-500 hover:bg-green-600 text-white w-full py-2 sm:py-3 rounded-lg shadow-md transition-all transform hover:scale-105 font-semibold text-sm sm:text-base">
                  {t.proceed_to_checkout}
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">{t.your_cart_is_empty}</p>
            <Link to="/shop">
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors text-sm">
                {t.start_shopping}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartCard;

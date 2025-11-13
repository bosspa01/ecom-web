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
      <h1 className="text-2xl font-bold mb-4 text-white">{t.shopping_cart}</h1>

      <div className="space-y-3">
        {carts.length > 0 ? (
          <>
            {carts.map((item, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg shadow-md border border-gray-600">
                <div className="flex justify-between mb-2">
                  <div className="flex gap-2 items-center flex-1">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        className="w-16 h-16 object-cover rounded-md"
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-600 rounded-md flex text-center items-center text-gray-400 text-xs">
                        {t.no_image}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate w-48">{item.title}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => actionRemoveProduct(item.id)}
                    className="text-red-400 hover:text-red-500 p-2 transition-colors"
                    title={t.remove}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="rounded-lg px-2 py-1 flex items-center gap-2 bg-gray-600">
                    <button
                      onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                      className="px-2 py-1 bg-gray-500 hover:bg-gray-400 rounded text-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-white font-medium">{numberFormat(item.count)}</span>
                    <button
                      onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                      className="px-2 py-1 bg-gray-500 hover:bg-gray-400 rounded text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="font-bold text-green-400">{numberFormat(item.price * item.count)}&nbsp;฿</div>
                </div>
              </div>
            ))}
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300 font-semibold">{t.total}:</span>
                <span className="text-2xl font-bold text-green-400">{numberFormat(getTotalPrice())}&nbsp;฿</span>
              </div>
              <Link to="/cart">
                <button className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg shadow-md transition-all transform hover:scale-105 font-semibold">
                  {t.proceed_to_checkout}
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">{t.your_cart_is_empty}</p>
            <Link to="/shop">
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
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

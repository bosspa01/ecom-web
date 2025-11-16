import React from "react";
import { ListCheck } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import useTranslation from "../../hooks/useTranslation";
import { Link, useNavigate } from "react-router-dom";
import { createUserCart } from "../../api/User";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";

const ListCart = () => {
  const t = useTranslation();
  const cart = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);
  const getTotalPrice = useEcomStore((state) => state.getTotalPrice);

  const navigate = useNavigate();

  const handleSaveCart = async() => {
      // send to back
      await createUserCart(token, { cart })
        .then((res) =>{ 
            console.log(res)
            toast.success(t.order_placed_successfully,{position:"top-center"});
            navigate("/checkout");
        })
        .catch((err) =>{ 
            console.log(err)
            toast.warning(err.response.data.message);
        });
    
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex gap-4 mb-6 items-center">
        <ListCheck size={36} className="text-green-400" />
        <p className="text-2xl font-bold text-white">{t.cart_items} ({cart.length})</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            {cart.map((item, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center flex-1">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        className="w-20 h-20 object-cover rounded-md"
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-600 rounded-md flex text-center items-center text-gray-400 text-xs">
                        {t.no_image}
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-sm text-gray-400">
                        {numberFormat(item.price)}&nbsp;฿ x {numberFormat(item.count)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-green-400 text-lg">{numberFormat(item.price * item.count)}&nbsp;฿</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 space-y-4">
            <p className="text-2xl font-bold text-white">{t.order_summary}</p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-600">
              <span className="text-gray-300 font-semibold">{t.total}:</span>
              <span className="text-2xl font-bold text-green-400">{numberFormat(getTotalPrice())}&nbsp;฿</span>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <button
                  onClick={handleSaveCart}
                  className="bg-green-500 w-full rounded-lg text-white py-3 shadow-md hover:bg-green-600 transition-all transform hover:scale-105 font-semibold"
                >
                  {t.proceed_to_checkout}
                </button>
              ) : (
                <Link to={"/login"}>
                  <button className="bg-green-500 w-full rounded-lg text-white py-3 shadow-md hover:bg-green-600 transition-all transform hover:scale-105 font-semibold">
                    {t.login_to_checkout}
                  </button>
                </Link>
              )}

              <Link to={"/shop"}>
                <button className="bg-gray-600 w-full rounded-lg text-white py-3 shadow-md hover:bg-gray-500 transition-colors">
                  {t.continue_shopping}
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">{t.your_cart_is_empty}</p>
          <Link to="/shop">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
              {t.start_shopping}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListCart;

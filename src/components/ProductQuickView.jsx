import React from "react";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import useEcomStore from "../store/ecom-store";
import useTranslation from "../hooks/useTranslation";

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const t = useTranslation();
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  const carts = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity);

  if (!isOpen || !product) return null;

  const cartItem = carts.find((item) => item.id === product.id);
  const quantity = cartItem?.count || 0;

  const handleAddToCart = () => {
    actionAddtoCart(product);
  };

  const handleIncreaseQuantity = () => {
    actionUpdateQuantity(product.id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      actionUpdateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div
        className="relative w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-700 rounded-full p-2 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                        <img
                          src={image.url}
                          alt={`${product.title} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500">{t.no_image}</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{product.title}</h2>
              {product.category && (
                <p className="text-green-400 text-sm mb-4">{product.category.name}</p>
              )}
              <p className="text-4xl font-bold text-green-400 mb-4">
                ${product.price?.toFixed(2) || product.price}
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">{t.description}</h3>
              <p className="text-gray-400 leading-relaxed">
                {product.description || t.no_description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {quantity > 0 ? (
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">{t.quantity}:</span>
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-2">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="text-white hover:text-green-400 transition-colors p-1"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={handleIncreaseQuantity}
                      className="text-white hover:text-green-400 transition-colors p-1"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  <span>{t.add_to_cart}</span>
                </button>
              )}

              {quantity > 0 && (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  <span>{t.update_cart}</span>
                </button>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">{t.availability}</p>
                  <p className="text-green-400 font-semibold">
                    {product.quantity > 0 ? t.in_stock : t.out_of_stock}
                  </p>
                </div>
                {product.quantity !== undefined && (
                  <div>
                    <p className="text-gray-500">{t.stock}</p>
                    <p className="text-white font-semibold">{product.quantity} {t.units}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;


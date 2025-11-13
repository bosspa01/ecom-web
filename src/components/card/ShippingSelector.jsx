import React from 'react';
import { Truck, Zap } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

const ShippingSelector = ({ selectedShipping, onShippingChange }) => {
  const t = useTranslation();
  
  const SHIPPING_OPTIONS = [
    {
      id: 'bangkok_standard',
      name: t.bangkok_standard,
      cost: 35,
      delivery: `3-5 ${t.business_days}`,
      icon: Truck
    },
    {
      id: 'bangkok_express',
      name: t.bangkok_express,
      cost: 50,
      delivery: `1-2 ${t.business_days}`,
      icon: Zap
    },
    {
      id: 'province_standard',
      name: t.province_standard,
      cost: 50,
      delivery: `5-7 ${t.business_days}`,
      icon: Truck
    },
    {
      id: 'province_express',
      name: t.province_express,
      cost: 75,
      delivery: `2-3 ${t.business_days}`,
      icon: Zap
    }
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Truck size={24} className="text-blue-400" />
        {t.select_shipping_method}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SHIPPING_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedShipping === option.id;
          
          return (
            <label
              key={option.id}
              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-102 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/30'
                  : 'border-gray-700 bg-gray-700/30 hover:border-gray-600 hover:bg-gray-700/50'
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={isSelected}
                onChange={(e) => onShippingChange(e.target.value)}
                className="w-4 h-4 text-blue-500 mt-1 cursor-pointer"
              />
              <div className="flex-1 ml-3">
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent size={18} className={isSelected ? "text-blue-400" : "text-gray-400"} />
                  <div className="font-semibold text-white">{option.name}</div>
                </div>
                <div className={`text-sm ${isSelected ? "text-blue-300" : "text-gray-400"}`}>
                  ⏱️ {option.delivery}
                </div>
              </div>
              <div className={`text-lg font-bold whitespace-nowrap ml-2 ${isSelected ? "text-blue-400" : "text-green-400"}`}>
                {option.cost}&nbsp;฿
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingSelector;

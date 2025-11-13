import React, { useState, useEffect } from 'react';
import useTranslation from '../../hooks/useTranslation';

const AddressForm = ({ onSave, savedAddress }) => {
  const t = useTranslation();
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    houseNumber: '',
    street: '',
    district: '',
    province: '',
    postalCode: ''
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (savedAddress) {
      setFormData(savedAddress);
      setIsSaved(true);
    }
  }, [savedAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['recipientName', 'phone', 'houseNumber', 'district', 'province', 'postalCode'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      return;
    }

    onSave(formData);
    setIsSaved(true);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-md">
      <h2 className="font-bold text-xl text-white mb-4">{t.shipping_info}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.recipient_name} <span className="text-red-400">{t.required_field}</span>
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.name_placeholder}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.phone} <span className="text-red-400">{t.required_field}</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.phone_placeholder}
            />
          </div>
        </div>

        {/* House Number & Street */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.house_number} <span className="text-red-400">{t.required_field}</span>
            </label>
            <input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.house_number_placeholder}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.street}
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.street_placeholder}
            />
          </div>
        </div>

        {/* District & Province */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.district} <span className="text-red-400">{t.required_field}</span>
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.district_placeholder}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.province} <span className="text-red-400">{t.required_field}</span>
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.province_placeholder}
            />
          </div>
        </div>

        {/* Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.postal_code} <span className="text-red-400">{t.required_field}</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              pattern="[0-9]{5}"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t.postal_code_placeholder}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaved}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold w-full md:w-auto"
        >
          {isSaved ? t.address_saved : t.save_address}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;

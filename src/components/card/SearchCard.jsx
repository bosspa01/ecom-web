import React, { use, useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import useTranslation from "../../hooks/useTranslation";
import Slider from "rc-slider";
import { numberFormat } from "../../utils/number";
import "rc-slider/assets/index.css";

const SearchCard = () => {
  const t = useTranslation();
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const actionSearchFilters = useEcomStore(
    (state) => state.actionSearchFilters
  );

  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [text, setText] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);
  const [price, setPrice] = useState([0, 10000]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  // Search text
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) {
        actionSearchFilters({ query: text });
      } else {
        getProduct();
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [text]);

  // Search by category
  const handleCheck = (e) => {
    const inCheck = e.target.value; // ค่าที่เราเลือก
    const inState = [...categorySelected]; // [] arr ว่าง
    const findCheck = inState.indexOf(inCheck); // ถ้าไม่เจอ return -1

    if (findCheck === -1) {
      inState.push(inCheck);
    } else {
      inState.splice(findCheck, 1);
    }
    setCategorySelected(inState);

    actionSearchFilters({ category: inState });
    if (inState.length > 0) {
      actionSearchFilters({ category: inState });
    } else {
      getProduct();
    }
  };

  // Search by price range
  useEffect(() => {
    actionSearchFilters({ price });
  }, [ok]);
  const handlePrice = (value) => {
    console.log("price value", value);
    setPrice(value);

    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Search by Text */}
      <div>
        <h1 className="text-xl font-bold mb-4 text-white">{t.search_products}</h1>
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder={t.search_placeholder}
          className="w-full mb-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          type="text"
        />
      </div>

      <hr className="border-gray-700" />

      {/* Search by Category */}
      <div>
        <h1 className="text-lg font-semibold mb-3 text-white">{t.categories}</h1>
        <div className="space-y-2">
          {categories.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-2">
              <input 
                onChange={handleCheck} 
                value={item.id} 
                type="checkbox"
                className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
              />
              <label className="text-gray-300 cursor-pointer hover:text-white transition-colors">{item.name}</label>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-700" />

      {/* Search by Price Range */}
      <div>
        <h1 className="text-lg font-semibold mb-3 text-white">{t.price_range}</h1>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>{t.min}: {numberFormat(price[0])}&nbsp;฿</span>
            <span>{t.max}: {numberFormat(price[1])}&nbsp;฿</span>
          </div>
          <div className="px-2">
            <Slider
              onChange={handlePrice}
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              trackStyle={{ backgroundColor: '#22c55e' }}
              handleStyle={{ borderColor: '#22c55e', backgroundColor: '#22c55e' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;

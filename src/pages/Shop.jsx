import React, { useEffect } from 'react'
import ProductCard from '../components/card/ProductCard'
import useEcomStore from '../store/ecom-store'
import SearchCard from '../components/card/SearchCard';
import CartCard from '../components/card/CartCard';
import useTranslation from '../hooks/useTranslation';

const Shop = () => {
    const t = useTranslation();
    const getProduct = useEcomStore((state) => state.getProduct);
    const products = useEcomStore((state) => state.products);

    useEffect(() => {
    getProduct();
    }, []);


  return (
    <div className='flex min-h-screen bg-gray-900'>

    {/* Search Bar */}
    <div className='w-1/4 p-4 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto'>
      <SearchCard />
    </div>

    {/* Product */}
    <div className='w-1/2 p-6 h-screen overflow-y-auto'>
      <h1 className='text-3xl font-bold mb-6 text-white'>{t.all_products}</h1>
      {products.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((item,index) => 
            <ProductCard item={item} key={item.id || index}/>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">{t.no_products_found}</p>
        </div>
      )}
    </div>

    {/* Cart */}
    <div className='w-1/4 p-4 bg-gray-800 border-l border-gray-700 h-screen overflow-y-auto'>
      <CartCard />
    </div>

    </div>
  )
}

export default Shop
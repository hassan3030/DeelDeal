

"use client";
import { useEffect, useState } from "react";
import { getProducts } from '@/callAPI/products'
import { getCookie } from '@/callAPI/utiles'
import { ItemsList } from '@/components/items-list'
import { HeaderComp } from './HeaderComp'

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showSwitchHeart, setShowSwitchHeart] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const productsData = await getProducts();
      setProducts(productsData);

      const token = await getCookie();
      if(token)  setShowSwitchHeart(true);
    }
    fetchData();
  }, []);

  return (
    <div className='mt-1 mx-4'>
      <HeaderComp/>
      <ItemsList items={products} showbtn={true} showSwitchHeart={showSwitchHeart}/>
    </div>
  );
}





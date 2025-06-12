
// import { getProducts } from '@/callAPI/products'
// import { getCookie } from '@/callAPI/utiles'
// import { ItemsList } from '@/components/items-list'
// import { HeaderComp } from './HeaderComp'
// import { getWishList } from '@/callAPI/swap'

// const ProductsPage = async() => {

//   const getWishList = async() => {
//  let token =  await getCookie();
//     if (token) {
//       return true;
//     }
//     else {
//       return false;
//     }
//   }
   
//    let products = await  getProducts() 
//    let showSwitchHeart = await getWishList();
//   return (
//     <div className='mt-1 mx-4'>
//     <HeaderComp/>
//         <ItemsList items={products} showbtn={true} showSwitchHeart={showSwitchHeart}/>
//     </div>
//   )
// }

// export default ProductsPage

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
      setShowSwitchHeart(!!token);
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





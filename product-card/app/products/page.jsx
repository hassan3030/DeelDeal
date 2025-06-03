
import { getProducts } from '@/callAPI/products'
import { ItemsList } from '@/components/items-list'
import { HeaderComp } from './HeaderComp'

const ProductsPage = async() => {

   let products = await  getProducts()
  return (
    <div className='mt-1 mx-4'>
    <HeaderComp/>
        <ItemsList items={products} showbtn={true}/>
    </div>
  )
}

export default ProductsPage





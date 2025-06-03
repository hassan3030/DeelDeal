
import { removeCookie ,getCookie , decodedToken } from "@/callAPI/utiles"
import { getProductByCategory} from "@/callAPI/products"
// import { getProducts} from "@/callAPI/products"
import { ItemsList } from "@/components/items-list";

const FilterItemsPage = async ({params}) => {
    const {cat} =  await params ;
    let products = await  getProductByCategory(cat)
    // let products = await  getProducts()
      
  return (
  <div className="my-3 mx-3">
<ItemsList items={products} showCategoriesFilter={false}/> 
 </div>
  )
}

export default FilterItemsPage
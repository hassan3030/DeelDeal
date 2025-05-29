
import { removeCookie ,getCookie , decodedToken } from "@/callAPI/utiles"
import { getProductByCategory} from "@/callAPI/products"
import { ItemsList } from "@/components/items-list";

const FilterItemsPage = async ({params}) => {
    const {cat} =  await params ;
    let products = await  getProductByCategory(cat)
      
  return (
  <>
<ItemsList items={products}/> 
 </>
  )
}

export default FilterItemsPage
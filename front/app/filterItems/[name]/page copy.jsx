
import { getProductSearchFilter } from "@/callAPI/products"
import { ItemsList } from "@/components/items-list";

const FilterItemsPage = async ({params}) => {
    const {name} =  await params ;
    let products = await  getProductSearchFilter(name)
      
  return (
  <div className="container py-8">
<ItemsList items={products}/> 
 </div>
  )
}

export default FilterItemsPage
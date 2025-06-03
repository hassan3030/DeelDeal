

import { ItemListingUpdate } from "@/components/item-listing-update"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getProductById , getImageProducts} from "@/callAPI/products"
import Link from "next/link"
import Image from "next/image"
import { ProductGallery } from "@/components/product-gallery"

export default async function NewItemPage({ params }) {
  const {id} = await params;
  const item = await getProductById(id)

  
  return (
    <>


     <div className="container py-10">
      <h1>{id}</h1>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to profile
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Update Your Item</h1>
        <p className="text-muted-foreground">Update a detailed listing to find the perfect swap for your item.</p>
      </div>

      <ItemListingUpdate {...item} />
    </div>
    </>
   
  )
}

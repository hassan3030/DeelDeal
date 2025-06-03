"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {  Edit, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast";
import { deleteProduct , getImageProducts } from "@/callAPI/products";

  
const ItemCard = ({item}) => {
    const { toast } = useToast();
    const [bigImage , setBigImage] =  useState('')
  const router = useRouter();

       const getDataImage = async () => {
        const images2 = await getImageProducts(item.images)
        // setImages(images)
        setBigImage(images2[0].directus_files_id)
     
      }
    const handleDelete = async () => {
    await deleteProduct(item.id);
   toast({
    title: "Item Deleted",
    description: "The item has been successfully deleted.",
    variant: "success", // Assuming your toast supports variants like 'success', 'error', etc.
  })
  router.refresh()
  // Add yo
  }
const dialogDelet = (
<Dialog>
        {/* Trigger Button */}
        <DialogTrigger asChild>
          <Button variant="primary">Delete</Button>
        </DialogTrigger>
        {/* Dialog Content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete One Items</DialogTitle>
            <DialogDescription>
              {/* This is a description of the dialog content. */}
            </DialogDescription>
          </DialogHeader>
          <p>Are you sure submit delete this items</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={()=>{handleDelete()}}>Delete</Button>
            </DialogClose>
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
)

useEffect(() => {
  getDataImage()
}
, [item.images])
  return (
  <div className="flex flex-col rounded-lg border sm:flex-row">

                        <div className="relative h-40 w-full sm:h-auto sm:w-40">
                          <Image
                            src={`http://localhost:8055/assets/${bigImage}`|| "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="rounded-t-lg object-cover sm:rounded-l-lg sm:rounded-tr-none"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3 className="font-medium capitalize ">{item.name}</h3>
                              <div className="mt-1 flex items-center gap-2 capitalize">
                                <Badge>{item.category}</Badge>
                                <Badge>{item.status_swap}</Badge>
                                <Badge variant={item.status_item === "available" ? "outline" : "secondary"}>
                                  {item.status_item}
                                </Badge>
                              </div>

<div className="mt-1 flex items-center gap-2 capitalize">
                
                                <Badge >Status Swap: {item.status_swap}</Badge>
                               
                              </div>


                            </div>
                            <div className="text-right">
                              <p className="font-semibold capitalize">
                           Value Estimate: {item.value_estimate}LE
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Listed on {new Date(item.date_created).toISOString().split("T")[0]}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                            <div className="flex items-center gap-2">
                              {/* in future */}
                              {/* <Label htmlFor={`featured-${item.id}`} className="flex items-center gap-2 text-sm">
                                <Switch id={`featured-${item.id}`} />
                                Featured
                              </Label> */}
                            </div>
                            <div className="flex gap-2">
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/products/${item.id}`}>
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </Link>
                              </Button>
                              <Button asChild variant="outline" size="sm">
                                <Link href={`settings/editItem/${item.id}`}>
                                  <Edit className="mr-1 h-4 w-4" />
                                  Edit
                                </Link>
                              </Button>


{/*  */}

{item.status_swap == "available"? (
  <Button variant="destructive" size="sm" >
    <Trash2 className="mr-1 h-4 w-4" />
    {dialogDelet}
  </Button>
): ''}
{/*  */}
                             
                            </div>
                          </div>
                        </div>
                      </div>
  )
}

export default ItemCard
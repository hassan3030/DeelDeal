
// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import { Badge } from "@/components/ui/badge"
// import { Edit, Trash2, Eye } from "lucide-react"
// import { useRouter } from "next/navigation"; 

// import {
//   Dialog, 
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { useToast } from "@/components/ui/use-toast";
// import { deleteProduct , getImageProducts } from "@/callAPI/products";
// import { useTranslations } from "@/lib/use-translations";

// const ItemCard = ({item}) => {
//     const { toast } = useToast();
//     const [bigImage , setBigImage] =  useState('')
//     const { t } = useTranslations();
//     const router = useRouter();

//     const getDataImage = async () => {
//       const images2 = await getImageProducts(item.images)
//       setBigImage(images2[0].directus_files_id)
//     }
//     const handleDelete = async () => {
//       await deleteProduct(item.id);
//       toast({
//         title: t("itemDeleted"),
//         description: t("itemDeletedDesc"),
//         variant: "success",
//       })
//       router.refresh()
//     }
//     const dialogDelet = (
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="primary">{t("delete")}</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{t("deleteOneItem")}</DialogTitle>
//             <DialogDescription>
//               {t("deleteDialogDesc")}
//             </DialogDescription>
//           </DialogHeader>
//           <p>{t("areYouSureDelete")}</p>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="secondary" onClick={()=>{handleDelete()}}>{t("delete")}</Button>
//             </DialogClose>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     )

//     useEffect(() => {
//       getDataImage()
//     }, [item.images])

//     return (
//       <div className="flex flex-col rounded-lg border sm:flex-row">
//         <div className="relative h-40 w-full sm:h-auto sm:w-40">
//           <Image
//             src={`http://localhost:8055/assets/${bigImage}`|| "/placeholder.svg"}
//             alt={item.name}
//             fill
//             className="rounded-t-lg object-cover sm:rounded-l-lg sm:rounded-tr-none"
//           />
//         </div>
//         <div className="flex flex-1 flex-col p-4">
//           <div className="mb-2 flex sm:flex-col justify-between ">
//             <div>
//               <h3 className="font-medium capitalize ">{item.name}</h3>
//               <div className="mt-1 flex items-center gap-2 capitalize">
//                 <Badge>{t(item.category)}</Badge>
//                 <Badge variant={item.status_item === "available" ? "outline" : "secondary"}>
//                   {t(item.status_item)}
//                 </Badge>
//               </div>
//               <div className="mt-1 flex items-center gap-2 capitalize">
//                 <Badge>{t("statusSwap")}: {t(item.status_swap)}</Badge>
//               </div>
//             </div>
            
// <div className="text-right">
//   <div className="flex flex-col items-end gap-1">
//     <span className="inline-flex items-center gap-2 rounded bg-orange-50 px-2 py-1 text-base font-bold text-orange-700 shadow-sm">
//       {t("aIExpectedPrice")}:
//       <span className="text-lg font-extrabold text-orange-900">{item.value_estimate} LE</span>
//     </span>
//     <span className="text-xs text-muted-foreground">

//       {t("listedOn")} {new Date(item.date_created).toISOString().split("T")[0]}
//     </span>
//   </div>
// </div>
//           </div>
//           <p className="text-sm text-muted-foreground line-clamp-1 overflow-hidden">{item.description}</p>
//           <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
//             <div className="flex items-center gap-2">
//               {/* Future feature */}
//             </div>
//             <div className="flex gap-2">
//               <Button asChild variant="outline" size="sm">
//                 <Link href={`/products/${item.id}`}>
//                   <Eye className="mr-1 h-4 w-4" />
//                   {t("view")}
//                 </Link>
//               </Button>
//               <Button asChild variant="outline" size="sm">
//                 <Link href={`settings/editItem/${item.id}`}>
//                   <Edit className="mr-1 h-4 w-4" />
//                   {t("edit")}
//                 </Link>
//               </Button>
//               {item.status_swap == "available"? (
//                 <Button variant="destructive" size="sm" >
//                   <Trash2 className="mr-1 h-4 w-4" />
//                   {dialogDelet}
//                 </Button>
//               ): ''}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
// }

// export default ItemCard


"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye } from "lucide-react"
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
import { useTranslations } from "@/lib/use-translations";

const ItemCard = ({item}) => {
    const { toast } = useToast();
    const [bigImage , setBigImage] =  useState('')
    const { t } = useTranslations();
    const router = useRouter();

    const getDataImage = async () => {
      const images2 = await getImageProducts(item.images)
      setBigImage(images2[0].directus_files_id)
    }
    const handleDelete = async () => {
      await deleteProduct(item.id);
      toast({
        title: t("itemDeleted"),
        description: t("itemDeletedDesc"),
        variant: "success",
      })
      router.refresh()
    }
    const dialogDelet = (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">{t("delete")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteOneItem")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <p>{t("areYouSureDelete")}</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" onClick={()=>{handleDelete()}}>{t("delete")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    useEffect(() => {
      getDataImage()
    }, [item.images])

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
          <div className="mb-2 flex sm:flex-col justify-between ">
            <div>
              <h3 className="font-medium capitalize ">{item.name}</h3>
              <div className="mt-1 flex items-center gap-2 capitalize">
                <Badge>{t(item.category)}</Badge>
                <Badge variant={item.status_item === "available" ? "outline" : "secondary"}>
                  {t(item.status_item)}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 capitalize">
                <Badge>{t("statusSwap")}: {t(item.status_swap)}</Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-2 rounded bg-orange-50 px-2 py-1 text-base font-bold text-orange-700 shadow-sm">
                  {t("aIExpectedPrice")}:
                  <span className="text-lg font-extrabold text-orange-900">{item.value_estimate} {t("currencyLE")}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("listedOn")} {new Date(item.date_created).toISOString().split("T")[0]}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 overflow-hidden">{item.description}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
            <div className="flex items-center gap-2">
              {/* Future feature */}
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/products/${item.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  {t("view")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`settings/editItem/${item.id}`}>
                  <Edit className="mr-1 h-4 w-4" />
                  {t("edit")}
                </Link>
              </Button>
              {item.status_swap == "available"? (
                <Button variant="destructive" size="sm" >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {dialogDelet}
                </Button>
              ): ''}
            </div>
          </div>
        </div>
      </div>
    )
}

export default ItemCard
"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Repeat, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"
import { getImageProducts } from "@/callAPI/products"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "./ui/skeleton"
import { getWishList, deleteWishList, addWishList } from "@/callAPI/swap";
import { decodedToken, getCookie } from "@/callAPI/utiles";

export function DeelProductCard({
  id,
  name,
  price,
  value_estimate,
  description,
  images,
  status_item,
  category,
  location ,
  showSwitchHeart= true,
  // showbtn = true,
}) {
  
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
    const [switchHeart, setswitchHeart] = useState(false);

  const { isRTL } = useLanguage()
  const { t } = useTranslations()
    const { toast } = useToast()
const makeSwap = async(e)=>{
  e.preventDefault()
  e.stopPropagation()
const token = await getCookie()

     if(token){
      router.push(`/swap/${id}`)
    }
    else{
toast({
        title: t("faildSwap") || "Faild Swap",
        description:  "Invalid swap without login. Please try to login.",
        variant: "destructive",
      })
      router.push(`/auth/login`)
    } 
  }
  // const [item , setItem] =  useState(product)
// const [images1 , setImages] =  useState([])
const [bigImage , setBigImage] =  useState('')
 const [loading, setLoading] = useState(true);
const router = useRouter()
// console.log("product" , product  )

  const getDataImage = async () => {
  const images2 = await getImageProducts(images)
  // setImages(images)
  setBigImage(images2[0].directus_files_id)
  console.log('i am in single product ' , images)
}

 const handleGetWishItem = async () => {
    const user = await decodedToken();
    const WishItem = await getWishList(user.id);
    if (WishItem && user) {
      const isItem = WishItem.find((i) => i.item_id == id) ? true : false;
      setswitchHeart(isItem);
    }
  };

  const handleAddWishItem = async () => {
    const user = await decodedToken();
    const WishItem = await getWishList(user.id);
    const WishItemId = WishItem.filter((i) => i.item_id == id);
    if (WishItem && user) {
      const isItem = WishItem.find((i) => i.item_id == id);
      if (isItem) {
        await deleteWishList(WishItemId[0]?.id);
        setswitchHeart(false);
        toast({
          title: t("successAddWish") || "Success",
          description:  t("successAddWishDesc") || "Item added to wishlist successfully.",
        });
      } else {
        await addWishList(id , user.id);
        setswitchHeart(true);
        toast({
            title: t("successAddWish") || "Success",
          description: t("deletedWishDesc") || "Deleted wishlist",
        });
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddingToCart(true)

    // Simulate API call for swap request
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsAddingToCart(false)
    setIsAddedToCart(true)

    // Reset added state after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false)
    }, 2000)
  }

  // const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  // Format currency based on language
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(isRTL ? "ar-EG" : "en-US", {
      style: "currency",
      currency: isRTL ? "EGP" : "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  useEffect(() => {
    getDataImage()
  }
  )
   useEffect(() => {
      handleGetWishItem();
    },[switchHeart]);
  return (
    <>
     <Link href={`/products/${id}`}>
      
      <div className="group relative flex w-[220px] flex-col overflow-hidden rounded-md border bg-background transition-all hover:shadow-md">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
          // imageSrc
          src={`http://localhost:8055/assets/${bigImage}`}
            alt={name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
             placeholder="blur"
             blurDataURL={`/placeholder.svg?height=300&width=300`}
             priority
             onLoadingComplete={() => setLoading(false)}
         
         />
{/* Heart button above photo */}
       {
        showSwitchHeart ? (<button
              type="button"
              className="absolute top-2 right-2 z-0 bg-transparent rounded-full p-1 hover:scale-110 transition-transform"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddWishItem();
              }}
            >
              {switchHeart ? (
                <Heart className="h-8 w-8 text-red-500 fill-current" />
              ) : (
                <Heart className="h-8 w-8 text-muted-foreground" />
              )}
            </button>):null
       }    
        
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <Badge className="bg-accent-orange text-white capitalize">{t(status_item)}</Badge>
          </div>

          {/* Favorite button */}
         

          {/* Discount badge */}
          {/* {discount > 0 && (
            <div className="absolute bottom-2 left-2 rounded-md bg-deep-orange px-1.5 py-0.5 text-xs font-bold text-white">
              {discount}% {t("off")}
            </div>
          )} */}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3">
          {/* Title */}
          <h3 className="mb-1 line-clamp-2 min-h-[40px] text-sm font-medium capitalize">{name}</h3>

          {/* Rating */}
          {/* <div className="mb-2 flex items-center gap-1">
            <div className="flex capitalize">
              {
                location? "yes location":"no location"
              }
            </div>
           
          </div> */}

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">{price}LE</span>
            </div>
          </div>

          {/* Swap button */}
          <Button
            className="mt-auto w-full bg-primary-yellow text-gray-800 hover:bg-primary-orange hover:text-white"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAddingToCart || isAddedToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                {t("requesting")}
              </span>
            ) : isAddedToCart ? (
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {t("requested")}
              </span>
            ) : (
              <span className="flex items-center gap-1"
              onClick={(e)=>{makeSwap(e)}}
              >
                <Repeat className="h-4 w-4" />
                {t("swap")}
              </span>
            )}
          </Button>
        </div>
      </div>
    </Link>
    </>
   
  )
}


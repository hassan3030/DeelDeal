"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {  Heart, Repeat, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils"
import { getImageProducts } from "@/callAPI/products"
import { getCookie } from "@/callAPI/utiles"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "@/lib/use-translations"

export function ItemCardProfile({
  id,
  name,
  price,
  value_estimate,
  description,
  images,
  status_item,
  status_swap,
  category,
  showbtn
}) {
 const { t } = useTranslations()
    const { toast } = useToast()
  const router = useRouter()

 const [bigImage , setBigImage] =  useState('')
 const getDataImage = async () => {
  const images2 = await getImageProducts(images)
  // setImages(images)
  setBigImage(images2[0].directus_files_id)
  // console.log('i am in single product ' , images)
}




  // const handleSaveClick = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   setIsSaved(!isSaved)
  //   // In a real app, you would save this to the user's favorites
  //   console.log(`Item ${id} ${!isSaved ? "saved" : "unsaved"}`)
  // }

  // const handleMakeOffer = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   // In a real app, this would navigate to the offer creation page
  //   console.log(`Make offer for item ${item.id}`)
  //   router.push(`/offers/create?itemId=${item.id}`)
  // }


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

  useEffect(()=>{
        getDataImage()
  })

  return (
        <Link href={`/products/${id}`}>
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={`http://localhost:8055/assets/${bigImage}` || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        
        <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground hover:bg-primary/90 capitalize">
          {category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          
            <h3 className="line-clamp-1 font-semibold group-hover:text-primary capitalize">{name}</h3>
 
         
        </div>
 <div className="flex items-center whitespace-nowrap text-sm font-semibold text-foreground text-green-500">
            AI Expected Price:LE {value_estimate}
          </div>
        <p className="mb-3 line-clamp-1 text-sm text-muted-foreground first-letter:capitalize">{description}</p>

        <div className="flex items-center whitespace-nowrap text-sm font-semibold text-foreground text-green-500">
           Price: {price}LE
          </div>
       
      </CardContent>

      {/* Swap button */}
      {status_swap == "available" && showbtn ? (
           <Button
            className="mt-auto w-full bg-primary-yellow text-gray-800 hover:bg-primary-orange hover:text-white"
            size="sm"
            onClick={(e)=>{makeSwap(e)}}
          >
               <Repeat className="h-4 w-4" />
                {t("swap")}
          </Button>
         ): ''}
         
    </Card>
        </Link>
  )
}

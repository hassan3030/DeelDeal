"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeftRight, ChevronRight, Heart, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn, formatCurrency, formatRelativeTime } from "@/lib/utils"
import { items  , currentUser, getUserItems, getUserOffers   } from "@/lib/data"
// export type Category =
//   | "Electronics"
//   | "RealEstate"
//   | "Vehicles"
//   | "Furniture"
//   | "Clothing"
//   | "Collectibles"
//   | "Sports"
//   | "Other"

// export interface ItemCardProps {
//   id: string
//   name: string
//   description: string
//   images: string[]
//   category: Category
//   valueEstimate: number
//   allowedCategories: Category[]
//   owner: {
//     id: string
//     name: string
//     avatar: string
//     rating: number
//     verified: boolean
//   }
//   location: string
//   createdAt: string
// }

export function ItemCard({item}) {
  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()

  const handleSaveClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
    // In a real app, you would save this to the user's favorites
    console.log(`Item ${item.id} ${!isSaved ? "saved" : "unsaved"}`)
  }

  const handleMakeOffer = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, this would navigate to the offer creation page
    console.log(`Make offer for item ${item.id}`)
    router.push(`/offers/create?itemId=${item.id}`)
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative">
        <Link href={`/items/${item.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={ "/placeholder.svg?height=400&width=400"}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
          onClick={handleSaveClick}
        >
          <Heart className={cn("h-4 w-4", isSaved ? "fill-primary text-primary" : "")} />
          <span className="sr-only">{isSaved ? "Unsave" : "Save"} item</span>
        </Button>
        <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground hover:bg-primary/90">
          {item.category}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link href={`/items/${item.id}`} className="group">
            <h3 className="line-clamp-1 font-semibold group-hover:text-primary">{item.name}</h3>
          </Link>
          <div className="flex items-center whitespace-nowrap text-sm font-semibold text-foreground">
            {formatCurrency(item?.valueEstimate)}
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

        <div className="mb-3">
          <div className="text-xs text-muted-foreground">Will swap for:</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {/* {allowedCategories.map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))} */}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item?.avatar || "/placeholder.svg"} alt={item.name} />
              <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{(item?.ratings ?? 0).toFixed(1)}</span>
  
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{formatRelativeTime(item?.date_created)}</div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t p-3">
        <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={handleMakeOffer}>
          <ArrowLeftRight className="h-4 w-4" />
          Make Offer
        </Button>
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href={`/items/${item.id}`}>
            Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Heart, Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageSrc: string
  isNew?: boolean
  onAddToCart?: (id: string) => void
}

export function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  imageSrc,
  isNew = false,
  onAddToCart,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onAddToCart) {
      setIsLoading(true)

      try {
        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 800))
        onAddToCart(id)

        // Show success state
        setIsAdded(true)
        setTimeout(() => {
          setIsAdded(false)
        }, 2000)
      } catch (error) {
        console.error("Failed to add to cart:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const increaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Link href={`/products/${id}`}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc || "/placeholder.svg?height=400&width=400"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute right-2 top-2 z-10">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>
          {isNew && <Badge className="absolute left-2 top-2 z-10">New</Badge>}
          {discount > 0 && (
            <Badge variant="destructive" className="absolute left-2 bottom-2 z-10">
              {discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="grid gap-2 p-4">
          <h3 className="font-semibold line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1 || isLoading}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Decrease quantity</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <span className="w-8 text-center">{quantity}</span>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={increaseQuantity}
                      disabled={quantity >= 10 || isLoading}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Increase quantity</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button className="ml-auto flex-1 gap-2" onClick={handleAddToCart} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : isAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </>
                )}
              </Button>
            </div>
            {isAdded && (
              <p className="text-center text-xs text-green-600">
                {quantity} {quantity === 1 ? "item" : "items"} added to your cart
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftRight, DollarSign, MessageCircle, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category } from "@/components/item-card"

interface Item {
  id: string
  name: string
  image: string
  category: Category
  valueEstimate: number
}

interface User {
  id: string
  name: string
  avatar: string
  rating: number
}

interface OfferCreatorProps {
  targetItem: Item
  targetUser: User
  myItems: Item[]
  onCancel: () => void
  onSubmitOffer: (offer: {
    targetItemId: string
    offeredItemIds: string[]
    cashAdjustment: number
    message: string
  }) => void
}

export function OfferCreator({ targetItem, targetUser, myItems, onCancel, onSubmitOffer }: OfferCreatorProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [cashAdjustment, setCashAdjustment] = useState<number>(0)
  const [message, setMessage] = useState<string>("")

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleCashAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    setCashAdjustment(isNaN(value) ? 0 : value)
  }

  const handleSubmit = () => {
    onSubmitOffer({
      targetItemId: targetItem.id,
      offeredItemIds: selectedItems,
      cashAdjustment,
      message,
    })
  }

  // Calculate total value of selected items
  const selectedItemsValue = myItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.valueEstimate, 0)

  // Calculate value difference
  const valueDifference = targetItem.valueEstimate - selectedItemsValue - cashAdjustment

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>You Want</CardTitle>
          <CardDescription>Item you're making an offer for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={targetItem.image || "/placeholder.svg?height=100&width=100"}
                alt={targetItem.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold">{targetItem.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {targetItem.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={targetUser.avatar || "/placeholder.svg"} alt={targetUser.name} />
                  <AvatarFallback>{targetUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{targetUser.name}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-lg font-semibold">Value: {formatCurrency(targetItem.valueEstimate)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Offer</CardTitle>
          <CardDescription>Select items to include in your swap</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {myItems.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                <div>
                  <p>You don't have any items to offer</p>
                  <Button variant="link" className="mt-2">
                    <Plus className="mr-1 h-4 w-4" />
                    List an item
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {myItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.image || "/placeholder.svg?height=50&width=50"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <label
                        htmlFor={`item-${item.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.name}
                      </label>
                      <span className="text-sm font-semibold">{formatCurrency(item.valueEstimate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="space-y-2">
            <label htmlFor="cash-adjustment" className="text-sm font-medium">
              Cash Adjustment (if needed)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="cash-adjustment"
                type="number"
                placeholder="0"
                className="pl-9"
                value={cashAdjustment || ""}
                onChange={handleCashAdjustmentChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message to Seller
            </label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why you're interested in this item..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Offer Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Your items total value:</span>
              <span className="font-semibold">{formatCurrency(selectedItemsValue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash adjustment:</span>
              <span className="font-semibold">{formatCurrency(cashAdjustment)}</span>
            </div>
            <div className="flex justify-between">
              <span>Target item value:</span>
              <span className="font-semibold">{formatCurrency(targetItem.valueEstimate)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span>Value difference:</span>
              <span
                className={`font-bold ${valueDifference === 0 ? "text-green-500" : valueDifference > 0 ? "text-red-500" : "text-yellow-500"}`}
              >
                {valueDifference === 0
                  ? "Fair trade!"
                  : formatCurrency(Math.abs(valueDifference)) + (valueDifference > 0 ? " short" : " extra")}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              Chat First
            </Button>
            <Button
              className="gap-1 bg-[#49c5b6] hover:bg-[#3db6a7]"
              onClick={handleSubmit}
              disabled={selectedItems.length === 0}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Submit Offer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

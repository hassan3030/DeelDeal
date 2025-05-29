"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import  ItemCard  from "./item-card"

import { getUserItems , items } from "@/lib/data"
import { ChevronLeft, Search, Edit, Trash2, Eye, Plus, AlertCircle, ChevronDownIcon } from "lucide-react"
import { PopoverAnchor } from "@radix-ui/react-popover"
import { getProductByUserId } from "@/callAPI/products"


export default function ManageItemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("active")
  const [items, setItems] = useState([])

  // Get user items
  // const allUserItems = getUserItems("user-1")
const filteredItems = async ()=>{
  const data = await getProductByUserId()
   setItems(data)
   console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg" , data)
  return data 
}

useEffect(()=>{
  filteredItems()
 
} , [])
  // Filter items based on search, category, and status
  // const filteredItems = allUserItems.filter((items) => {
  //   const matchesSearch =
  //     searchTerm === "" ||
  //     items.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     items.description.toLowerCase().includes(searchTerm.toLowerCase())

  //   const matchesCategory = category === "all" || items.category === category

  //   const matchesStatus = status === "all" || items.status === status

  //   const matchesTab =
  //     (activeTab === "active" && items.status === "Available") ||
  //     (activeTab === "inactive" && items.status !== "Available")

  //   return matchesSearch && matchesCategory && matchesStatus && matchesTab
  // })

  
  return (
    <>


    <div className="container py-8">
      <div className="mb-6 flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/profile">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Manage Items</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle>Your Items</CardTitle>
                <CardDescription>Manage, edit, and update your listed items.</CardDescription>
              </div>
              <Button asChild>
                <Link href="/items/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList>
                  <TabsTrigger value="active">Active Items</TabsTrigger>
                  {/* <TabsTrigger value="inactive">Inactive Items</TabsTrigger> */}
                </TabsList>

                {/* <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[200px]"
                    />
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Cars">Cars</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Swapped">Swapped</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>

              <TabsContent value="active" className="mt-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No items found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchTerm || category !== "all" || status !== "all"
                        ? "Try adjusting your search or filters"
                        : "You don't have any active items. Add a new item to get started!"}
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/items/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Item
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />

                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inactive" className="mt-6">
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No inactive items</h3>
                  <p className="mt-1 text-sm text-muted-foreground">You don't have any inactive items.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}

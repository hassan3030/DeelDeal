"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"
import { ItemCard } from "./item-card"
import { Pagination } from "@/components/ui/pagination"
import { items } from "@/lib/data"

export function ItemsList({ userId, showFilters = true }) {
  const [displayedItems, setDisplayedItems] = useState(items)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)
  const itemsPerPage = 12
  const router = useRouter()

  // Calculate pagination
  const totalItems = displayedItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedItems = displayedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Filter items based on userId if provided
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      let filteredItems = items

      // Filter by user if userId is provided
      if (userId) {
        filteredItems = filteredItems.filter((item) => item.user_id === userId)
      }

      // Filter by category if not "all"
      if (category !== "all") {
        filteredItems = filteredItems.filter((item) => item.category === category)
      }

      // Filter by search term if provided
      if (searchTerm) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      setDisplayedItems(filteredItems)
      setIsLoading(false)
    }, 500) // Simulate loading delay
  }, [userId, category, searchTerm])

  const handleSearch = () => {
    setPage(1)
    // Search is handled in the useEffect
  }

  const handleCategoryChange = (value) => {
    setCategory(value)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Cars">Cars</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm || category !== "all"
              ? "Try adjusting your search or filters"
              : "Be the first to list an item!"}
          </p>
          <Button onClick={() => router.push("/items/new")}>List an Item</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  )
}

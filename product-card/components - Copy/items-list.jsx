"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { ItemCardProfile } from "./item-card-profile";
import { categoriesName } from "@/lib/data";
import { DeelProductCard } from "./deel-product-card";
import { DeelProductCardSkeleton } from "./DeelProductCardSkeleton";
import { useTranslations } from "@/lib/use-translations";

export function ItemsList({
  items,
  showFilters = true,
  showCategoriesFilter = true,
  showbtn = true,
  showSwitchHeart = true,
}) {
  const [displayedItems, setDisplayedItems] = useState(items);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { t } = useTranslations();
  const itemsPerPage = 8;

  // Filtering and pagination
  useEffect(() => {
    setIsLoading(true);
    let filtered = items;

    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayedItems(filtered);
    setPage(1); // Reset to first page on filter/search change
    setIsLoading(false);
  }, [items, category, searchTerm]);

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(displayedItems.length / itemsPerPage)
  );
  const paginatedItems = displayedItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearch = () => setPage(1);
  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    // <DeelProductCardSkeleton/>
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              placeholder={t("searcItems")||"Search items..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => {
                handleSearch;
              }}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {showCategoriesFilter && (
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("showAllCategories" || "Show All Categories" )} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all" className="capitalize">
                {t("allCategories"||"  All Categories")}
                </SelectItem>
                {categoriesName.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {t(cat)|| cat }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
          <p className="text-lg font-medium">{t("noItemsFound")||"No items found"}</p>
          <p className="text-sm text-muted-foreground">
            {/* {searchTerm || category !== "all"
              ? "Try adjusting your search or filters"
              : "Be the first to list an item!"} */}
          </p>
          <Button onClick={() => router.push("/")}>
          {t("goBack") ||"Go Back"}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedItems.map((item) => (
              <ItemCardProfile
                key={item.id}
                {...item}
                showbtn={showbtn}
                showSwitchHeart={showSwitchHeart}
              />
            ))}
          </div>
          <SimplePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}



// SimplePagination.jsx (or inside your items-list.jsx)
function SimplePagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslations();

  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
      {t("prev")||"Prev"}
      </button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx + 1}
          className={`px-3 py-1 border rounded ${
            currentPage === idx + 1
              ? "bg-primary text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t("next")||"Next"}
      </button>
    </div>
  );
}

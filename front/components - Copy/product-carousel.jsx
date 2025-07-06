"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"

export function ProductCarousel({ title, viewAllHref, viewAllLabel, children }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const containerRef = useRef(null)
  const { isRTL } = useLanguage()

  const checkScrollability = () => {
    const container = containerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container

    if (isRTL) {
      // In RTL mode, scrollLeft is negative
      setCanScrollLeft(scrollLeft < 0)
      setCanScrollRight(Math.abs(scrollLeft) < scrollWidth - clientWidth - 1)
    } else {
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener("resize", checkScrollability)
    return () => window.removeEventListener("resize", checkScrollability)
  }, [isRTL])

  const scroll = (direction) => {
    const container = containerRef.current
    if (!container) return

    const scrollAmount = 320 // Approximate width of a product card + gap
    const currentScroll = container.scrollLeft

    if (isRTL) {
      // In RTL mode, scrolling right means decreasing the negative scrollLeft value
      container.scrollTo({
        left: direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount,
        behavior: "smooth",
      })
    } else {
      container.scrollTo({
        left: direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount,
        behavior: "smooth",
      })
    }

    // Update buttons after scrolling
    setTimeout(checkScrollability, 300)
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {viewAllHref && (
          <a href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            {viewAllLabel}
          </a>
        )}
      </div>

      <div className="relative">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border bg-background shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
        )}

        {/* Products container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide"
          onScroll={checkScrollability}
        >
          {children}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full border bg-background shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        )}
      </div>
    </div>
  )
}

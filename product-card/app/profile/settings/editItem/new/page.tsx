"use client"

import { ItemListingForm } from "@/components/item-listing-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewItemPage() {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to profile
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">List a New Item</h1>
        <p className="text-muted-foreground">Create a detailed listing to find the perfect swap for your item.</p>
      </div>
      <ItemListingForm />
    </div>
  )
}

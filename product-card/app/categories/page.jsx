"use client"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/lib/use-translations"
import { CategoryCard } from "@/components/category-card"
import { categories } from "@/lib/data"
const CategoriesPage = () => {
    const { t } = useTranslations()
  return (
  <>
   {/* Categories */}
      <section className="container py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("categories")}</h2>
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("back")|| "Go Back"}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div> 


        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6  ">

          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>

  </>
  )
}

export default CategoriesPage
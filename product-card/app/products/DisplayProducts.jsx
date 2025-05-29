"use client"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useTranslations } from "@/lib/use-translations"
import { ChevronRight } from 'lucide-react'
import { getProducts } from '@/callAPI/products'
import { ItemsList } from '@/components/items-list'

const DisplayProducts = () => {
  const { t } = useTranslations()
  const [items, setItems] = useState([])

  useEffect(() => {
    const getData = async () => {
      const data = await getProducts()
      setItems(data)
      console.log("all products ", data)
    }
    getData()
  }, [])

  return (
    <>
      <section className="container py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("allProducts")}</h2>
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("back")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <ItemsList items={items} />
      </section>
    </>
  )
}

export default DisplayProducts
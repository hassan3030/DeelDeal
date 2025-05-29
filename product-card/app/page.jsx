"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeelProductCard } from "@/components/deel-product-card"
import { CategoryCard } from "@/components/category-card"
import { ProductCarousel } from "@/components/product-carousel"
import { HeroSlider } from "@/components/hero-slider"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"
import { categories } from "@/lib/data"
// import { getProducts , getProductSearchFilter  , getAllImageProducts} from '@/callAPI/products'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllImageProducts, getProducts , getProductTopPrice } from "@/callAPI/products"



export default function Home() {
  const { isRTL } = useLanguage()
  const { t } = useTranslations()
const [items, setItems] = useState([])
const [topPrice, setTopPrice] = useState([])
  // const [filter, setFilter] = useState('')
  // const [images, setImages] = useState([])
   const router = useRouter()

  const getData = async () => {
    const data = await getProducts()
    const topPrice = await getProductTopPrice()
    setItems(data)
    setTopPrice(topPrice)
    console.log('i am in product home ' , data)
    console.log('i am in product topPrice ' , topPrice)
    
    return data
    // const image = await getAllImageProducts()
    // setImages(image)
   
  }
 

  // const getDataByFilter = async () => {
  //   const data = await getProductSearchFilter(filter)
  //   setItems(data)
  // }
 
  useEffect(() => {
      getData()
  }, []);
      useEffect(() => {
      getData()
  }, [items , topPrice]);
     
  return (
    // #items don't foget
   <>
    <main className="min-h-screen">
    
      {/* Hero Section */}
      <section className="container py-6">
        <HeroSlider />
      </section>
 
      {/* Categories */}
      <section className="container py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("categories")}</h2>
          <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t("viewAll")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>


        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6  ">

          {categories.slice(0,5).map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>


      {/* Middle Banner */}
      <section className="container py-8">
        <div className="overflow-hidden rounded-lg bg-gradient-to-r from-primary-orange to-secondary-orange">
          <div className="container relative flex min-h-[150px] flex-col items-center justify-center py-8 text-center md:min-h-[200px]">
            <Button className="bg-white text-deep-orange hover:bg-gray-100"
            onClick={()=>{router.push('products')}}
            >{t("swapNow")}</Button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container py-8">
        <ProductCarousel title={t("allProducts")} viewAllHref="/products" viewAllLabel={t("viewAll")}>
          {items.map((product) => (
            <DeelProductCard key={product.id} {...product} />
          ))}
        </ProductCarousel>
      </section>

      {/* Top Deals */}
      <section className="container py-8">
        <ProductCarousel title={t("topDeals")} viewAllHref="/deals" viewAllLabel={t("")}>
          {topPrice.map((product) => (
            <DeelProductCard key={product.id} {...product} />
          ))}
        </ProductCarousel>
      </section>

      {/* App Download Section in Th future  */}
      {/* <section className="container py-8">
        <div className="overflow-hidden rounded-lg bg-gradient-to-r from-accent-orange to-deep-orange">
          <div className="container relative flex flex-col items-center justify-between gap-8 py-8 md:flex-row md:py-12">
            <div className="text-center text-white md:text-left">
              <h2 className="mb-2 text-2xl font-bold md:text-3xl">{t("downloadApp")}</h2>
              <p className="mb-6">{t("betterExperience")}</p>
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                <Link href="#">
                  <Image
                    src="/placeholder.svg?height=40&width=120&text=App+Store"
                    alt="App Store"
                    width={120}
                    height={40}
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="/placeholder.svg?height=40&width=120&text=Google+Play"
                    alt="Google Play"
                    width={120}
                    height={40}
                  />
                </Link>
              </div>
            </div>
            <div className="relative h-[200px] w-[200px] md:h-[300px] md:w-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=300&text=App+Screenshot"
                alt="App Screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section> */}
    </main>
   </>
  )
}

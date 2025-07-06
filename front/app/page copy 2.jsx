"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, ShieldCheck, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeelProductCard } from "@/components/deel-product-card"
import { CategoryCard } from "@/components/category-card"
import { ProductCarousel } from "@/components/product-carousel"
import { DeelProductCardSkeleton } from "@/components/DeelProductCardSkeleton"
import { HeroSlider } from "@/components/hero-slider"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"
import { categories } from "@/lib/data"
import { useRouter } from "next/navigation"
import { getProducts, getProductTopPrice } from "@/callAPI/products"
import { getCookie } from "@/callAPI/utiles"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const statsItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.8,
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

// Counter animation component
const AnimatedCounter = ({ value, duration = 2, className }) => {
  const [count, setCount] = useState(0)
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      let startTime
      const startValue = 0
      const endValue = value

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        const currentCount = Math.floor(progress * (endValue - startValue) + startValue)

        setCount(currentCount)

        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }

      window.requestAnimationFrame(step)
      controls.start("visible")
    }
  }, [inView, value, duration, controls])

  return (
    <motion.div ref={ref} animate={controls} initial="hidden" variants={statsItemVariants} className={className}>
      {count}
      {value === 99.9 ? "%" : "K+"}
    </motion.div>
  )
}

export default function Home() {
  const { isRTL } = useLanguage()
  const { t } = useTranslations()
  const [items, setItems] = useState([])
  const [topPrice, setTopPrice] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCat, setIsLoadingCat] = useState(true)
  const [showSwitchHeart, setShowSwitchHeart] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const getWishList = async () => {
    const token = await getCookie()
    if (token) {
      setShowSwitchHeart(true)
    }
  }

  const router = useRouter()

  const getData = async () => {
    const data = await getProducts()
    const topPrice = await getProductTopPrice()
    setItems(data)
    setTopPrice(topPrice)
    console.log("i am in product home ", data)
    console.log("i am in product topPrice ", topPrice)

    return data
  }

  useEffect(() => {
    setIsLoading(true)
    setIsLoadingCat(true)

    try {
      getData().then(() => {
        setIsLoading(false)
      })
      setIsLoadingCat(false)
      getWishList()
    } catch (error) {
      console.error("Error fetching data:", error)
      setIsLoading(false)
      setIsLoadingCat(false)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <>
      <main className="min-h-screen dark:bg-[#121212]">
        {/* Hero Section */}
        <section className="container py-6">
          <HeroSlider />
        </section>

        {/* Stats Section - New section based on the image */}
        <motion.section
          className="container py-12"
          variants={statsContainerVariants}
          initial="hidden"
          animate="visible"
          ref={ref}
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div className="flex items-center justify-center mb-4" variants={statsItemVariants}>
                <Users className="h-8 w-8 md:h-12 md:w-12 text-primary dark:text-primary" />
              </motion.div>
              <AnimatedCounter value={10} className="text-3xl md:text-5xl font-bold gold-text-gradient" />
              <motion.div className="text-sm md:text-base text-muted-foreground mt-2" variants={statsItemVariants}>
                Active Traders
              </motion.div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <motion.div className="flex items-center justify-center mb-4" variants={statsItemVariants}>
                <ShieldCheck className="h-8 w-8 md:h-12 md:w-12 text-primary dark:text-primary" />
              </motion.div>
              <AnimatedCounter value={99.9} className="text-3xl md:text-5xl font-bold gold-text-gradient" />
              <motion.div className="text-sm md:text-base text-muted-foreground mt-2" variants={statsItemVariants}>
                Safe Trades
              </motion.div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <motion.div className="flex items-center justify-center mb-4" variants={statsItemVariants}>
                <Package className="h-8 w-8 md:h-12 md:w-12 text-primary dark:text-primary" />
              </motion.div>
              <AnimatedCounter value={50} className="text-3xl md:text-5xl font-bold gold-text-gradient" />
              <motion.div className="text-sm md:text-base text-muted-foreground mt-2" variants={statsItemVariants}>
                Items Traded
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Categories */}
        <section className="container py-8">
          <motion.div className="mb-8 text-center" variants={titleVariants} initial="hidden" animate="visible">
            <h2 className="text-3xl md:text-4xl font-bold gold-text-gradient mb-4">Browse Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover amazing items across various categories and find exactly what you're looking for
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoadingCat
              ? Array.from({ length: 6 }).map((_, i) => <DeelProductCardSkeleton key={i} />)
              : categories.slice(0, 6).map((category, index) => (
                  <motion.div key={category.name} variants={itemVariants} custom={index}>
                    <CategoryCard {...category} />
                  </motion.div>
                ))}
          </motion.div>
        </section>

        {/* Middle Banner */}
        <section className="container py-8">
          <motion.div
            className="overflow-hidden rounded-lg bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#333] relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1200')] opacity-10 bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
            </div>

            <div className="container relative flex min-h-[150px] flex-col items-center justify-center py-8 text-center md:min-h-[200px] z-10">
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-white mb-6 gold-text-gradient"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Ready to Trade Your Items?
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-primary text-black hover:bg-primary/90 font-semibold px-8 py-6 text-lg"
                  onClick={() => {
                    router.push("/products")
                  }}
                >
                  {t("swapNow")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Products */}
        <motion.section
          className="container py-8"
          id="items"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <ProductCarousel title={t("allProducts")} viewAllHref="/products" viewAllLabel={t("viewAll")}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <DeelProductCardSkeleton key={i} />)
              : items.map((product) => (
                  <DeelProductCard key={product.id} {...product} showSwitchHeart={showSwitchHeart} />
                ))}
          </ProductCarousel>
        </motion.section>

        {/* Top Deals */}
        <section className="container py-8">
          <ProductCarousel title={t("topDeals")} viewAllHref="/products" viewAllLabel={t("viewAll")}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <DeelProductCardSkeleton key={i} />)
              : topPrice.map((product) => (
                  <DeelProductCard key={product.id} {...product} showSwitchHeart={showSwitchHeart} />
                ))}
          </ProductCarousel>
        </section>
      </main>
    </>
  )
}

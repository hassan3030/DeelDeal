"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeelProductCard } from "@/components/deel-product-card";
import { CategoryCard } from "@/components/category-card";
import { ProductCarousel } from "@/components/product-carousel";
import { HeroSlider } from "@/components/hero-slider";
import { useLanguage } from "@/lib/language-provider";
import { useTranslations } from "@/lib/use-translations";
import { categories } from "@/lib/data";
// import { getProducts , getProductSearchFilter  , getAllImageProducts} from '@/callAPI/products'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllImageProducts,
  getProducts,
  getProductTopPrice,
} from "@/callAPI/products";

export default function Home() {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  const [items, setItems] = useState([]);
  const [topPrice, setTopPrice] = useState([]);
  // const [filter, setFilter] = useState('')
  // const [images, setImages] = useState([])
  const router = useRouter();

  const getData = async () => {
    const data = await getProducts();
    const topPrice = await getProductTopPrice();
    setItems(data);
    setTopPrice(topPrice);
    console.log("i am in product home ", data);
    console.log("i am in product topPrice ", topPrice);

    return data;
    // const image = await getAllImageProducts()
    // setImages(image)
  };

  // const getDataByFilter = async () => {
  //   const data = await getProductSearchFilter(filter)
  //   setItems(data)
  // }

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [items, topPrice]);

  return (
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
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("viewAll")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6  ">
            {categories.slice(0, 5).map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </section>

        {/* Middle Banner */}
        <section className="container py-4">
          <div className="overflow-hidden rounded-lg bg-gradient-to-r from-primary-orange to-secondary-orange">
            <div className="container relative flex min-h-[150px] flex-col items-center justify-center py-8 text-center md:min-h-[200px]">
              <Button
                className="bg-white text-deep-orange hover:bg-gray-100"
                onClick={() => {
                  router.push("/products");
                }}
              >
                {t("swapNow")}
              </Button>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="container py-8" id="items">
          <ProductCarousel
            title={t("allProducts")}
            viewAllHref="/products"
            viewAllLabel={t("viewAll")}
          >
            {items.map((product) => (
              <DeelProductCard key={product.id} {...product} />
            ))}
          </ProductCarousel>
        </section>

        {/* Top Deals */}
        <section className="container py-8">
          <ProductCarousel
            title={t("topDeals")}
            viewAllHref="/deals"
            viewAllLabel={t("viewAll")}
          >
            {topPrice.map((product) => (
              <DeelProductCard key={product.id} {...product} />
            ))}
          </ProductCarousel>
        </section>
      </main>
    </>
  );
}

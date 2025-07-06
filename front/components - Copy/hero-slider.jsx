
"use client"
import Image from "next/image"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function HeroSlider() {
  const { isRTL } = useLanguage()
  
  const [imageReal , setImageReal] = useState( "/home/pexels-pixabay-273209.jpg")
  const [imageCar , setImageCar] = useState("/home/pexels-mayday-1545743.jpg")
  const [imageTools , setImageTools] = useState("/home/pexels-adonyi-foto-1409215.jpg")
  const { t } = useTranslations()

  const changeImages = () => {
    setInterval(() => {
       setImageReal("/home/pexels-expect-best-79873-323780.jpg")
    setImageCar("/home/pexels-pixabay-39501.jpg")
    setImageTools("/home/pexels-adonyi-foto-1409215.jpg")
    }, 5000)

setInterval(() => {
      
    setImageCar("/home/pexels-pixabay-39501.jpg")
   
    }, 5000)

setInterval(() => {
    }, 10000)
   
    

// setInterval(() => {
//  setImageReal("/home/pexels-pixabay-273209.jpg")
//     setImageCar("/home/pexels-mayday-1545743.jpg")
//     setImageTools("/home/pexels-energepic-com-27411-175039.jpg")
//     }, 10000)
   
  }
  useEffect(() => {
changeImages()
  } )
  return (
  <>
  <div className="absolute inset-0 z-0 overflow-hidden">
  </div>


    <div className="relative overflow-hidden rounded-lg">

  
      <div className="relative">
        <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-[#f5f2fc] to-[#fff1e8] dark:bg-gradient-to-br dark:from-[#2a2438] dark:to-[#352e1b] md:h-[600px]">
          <div className="container relative z-10 flex h-full flex-col items-start justify-center py-12">
            <h1 className="mb-2 max-w-xl text-4xl font-bold text-dark-accent dark:text-dark-accent md:text-5xl lg:text-6xl     bg-gradient-to-r from-yellow-300 via-yellow-600 to-yellow-900 text-transparent bg-clip-text">
              {t("deelDeal")}
            </h1>
            <h2 className=" mb-4 max-w-xl text-3xl font-bold text-foreground dark:text-foreground md:text-4xl lg:text-5xl">
              {t("deelDealSlogan")}
            </h2>
            <p className="mb-8 max-w-xl text-lg text-foreground dark:text-foreground md:text-xl">
              {t("deelDealDescription")}
            </p>
            <div className="flex flex-wrap gap-4">
             
              <Button
                size="lg"
                variant="outline"
                className="border-dark-accent text-lg text-dark-accent hover:bg-dark-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10"
                asChild
                 
              >
                <a href="/#items"
                className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
                >{t("browseItems")}</a>
              </Button>
            </div>
          </div>

          <div
            className="absolute inset-0 hidden md:block"
            style={{ [isRTL ? "left" : "right"]: 0, [isRTL ? "right" : "left"]: "50%" }}
          >
            <div className="relative h-full w-full ">
              {/* Main image */}
              <div  className=" absolute  right-[10%] top-[20%] h-[250px] w-[250px] overflow-hidden rounded-lg shadow-xl hover:scale-110">
                <Image
                  src={imageReal}
                  alt="Real Estate"
                  fill
                  className="object-cover"
                
                />
              </div>

              {/* Secondary images */}
              <div className="absolute right-[30%] top-[50%] h-[180px] w-[180px] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={imageCar}
                  alt="Cars"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute right-[15%] top-[60%] h-[150px] w-[150px] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={imageTools}
                  alt="Home Tools"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  
  )
}

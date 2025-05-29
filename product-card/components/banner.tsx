"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"

interface BannerProps {
  title: string
  subtitle?: string
  buttonText: string
  href: string
  imageSrc: string
  imageAlt: string
  theme?: "light" | "dark"
}

export function Banner({ title, subtitle, buttonText, href, imageSrc, imageAlt, theme = "light" }: BannerProps) {
  const { isRTL } = useLanguage()

  return (
    <div className={`relative overflow-hidden rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-[#feee00]"}`}>
      <div className="container relative z-10 flex min-h-[300px] flex-col items-start justify-center py-12 md:min-h-[400px]">
        <h2
          className={`mb-2 max-w-md text-3xl font-bold md:text-4xl lg:text-5xl ${
            theme === "dark" ? "text-white" : "text-[#404553]"
          }`}
        >
          {title}
        </h2>

        {subtitle && (
          <p className={`mb-6 max-w-md text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{subtitle}</p>
        )}

        <Button
          asChild
          className={
            theme === "dark" ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-[#404553] text-white hover:bg-[#333]"
          }
        >
          <Link href={href}>{buttonText}</Link>
        </Button>
      </div>

      <div className={`absolute inset-0 ${isRTL ? "left-0 right-1/3" : "left-1/3 right-0"} hidden md:block`}>
        <Image src={imageSrc || "/placeholder.svg"} alt={imageAlt} fill className="object-contain" />
      </div>
    </div>
  )
}

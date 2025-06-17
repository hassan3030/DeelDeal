"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "@/lib/use-translations"

 

interface CategoryCardProps {
  name: string
  imageSrc: string
}

export function CategoryCard({ name, imageSrc }: CategoryCardProps) {
     const { t } = useTranslations()
  return (

    <Link href={`categories/${name}`} className="group block  ">
      <div className="flex flex-col items-center gap-2 " >
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted transition-all group-hover:shadow-md   ">
          <Image
            src={imageSrc || "/placeholder.svg?height=200&width=200"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="text-center text-sm font-medium capitalize ">{t(`${name}`)}</span>
      </div>
    </Link>
  )
}

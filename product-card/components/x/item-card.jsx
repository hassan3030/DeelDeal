import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Verified, MapPin } from "lucide-react"

export function ItemCard({ item }) {
  // Get the first image or use a placeholder
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(item.name)}`

  // Format the price with commas and currency symbol
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(item.value_estimate)

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge className="absolute left-2 top-2 bg-primary">{item.category}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 text-lg font-semibold">{item.name}</h3>
          <p className="line-clamp-2 mt-1 text-sm text-muted-foreground">{item.description}</p>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            <span>
              {item.location.city}, {item.location.country}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-2">
            {item.user?.profile_image ? (
              <Image
                src={item.user.profile_image || "/placeholder.svg"}
                alt={item.user.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {item.user?.name.charAt(0)}
              </div>
            )}
            <span className="text-sm">{item.user?.name}</span>
            {item.user?.verified && <Verified className="h-3 w-3 text-blue-500" />}
          </div>
          <div className="font-semibold">{formattedPrice}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}

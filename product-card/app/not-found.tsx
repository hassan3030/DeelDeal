import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-[70vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Product Not Found</h1>
      <p className="mb-6 mt-2 text-muted-foreground">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}

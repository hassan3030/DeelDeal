
"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { getWishList, deleteWishList } from "@/callAPI/swap";
import { getProductById } from "@/callAPI/products";
import { decodedToken } from "@/callAPI/utiles";



const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const user = await decodedToken();
        if (!user?.id) return setWishlistItems([]);
        const wishList = await getWishList(user.id);
        const items = await Promise.all(
          wishList.map(async (wish) => {
            const product = await getProductById(wish.item_id);
            let imageUrl = "/placeholder.svg";
            if (product.images && product.images.length > 0) {
              if (typeof product.images[0] === "string") {
                imageUrl = `http://localhost:8055/assets/${product.images[0]}`;
              } else if (product.images[0].directus_files_id) {
                imageUrl = `http://localhost:8055/assets/${product.images[0].directus_files_id}`;
              }
            }
            return {
              wishlist_id: wish.id,
              id: product.id,
              name: product.name,
              image: imageUrl,
              category: product.category,
              description: product.description,
              dateAdded: new Date(wish.date_created).toLocaleDateString(),
            };
          })
        );
        setWishlistItems(items);
      } catch (err) {
        setWishlistItems([]);
      }
      setLoading(false);
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (wishlistId) => {
    await deleteWishList(wishlistId);
    setWishlistItems((prev) => prev.filter((item) => item.wishlist_id !== wishlistId));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>
        <Heart className="h-8 w-8 text-red-500 fill-current" />
      </header>

      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Start browsing and save items you'd like to swap for
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistItems.map((item) => (
            <WishlistCard key={item.wishlist_id} item={item} onRemove={removeFromWishlist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

// -----------------------------


const  WishlistCard = ({ item, onRemove })=> {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            onClick={() => onRemove(item.wishlist_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg capitalize">{item.name}</CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded capitalize">
            {item.category}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 capitalize line-clamp-1">
          {item.description}
        </p>
        <p className="text-xs text-muted-foreground">
          Saved: {item.dateAdded}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Link href={`/products/${item.id}`}>
            <Button variant="outline" className="flex-1">
              View Details
            </Button>
          </Link>
          <Link href={`/swap/${item.id}`}>
            <Button className="flex-1">
              Start Swap
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

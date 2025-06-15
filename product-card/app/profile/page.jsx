"use client";
import Link from "next/link";
import { ItemsList } from "@/components/items-list";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Verified,
  ArrowLeftRight,
  Package,
  Clock,
  Settings,
  ArrowLeft,
  BellDot,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "@/lib/use-translations";
import { getUserById, getUserByProductId } from "@/callAPI/users";
import { getProductByUserId, getProductById } from "@/callAPI/products";
import {
  getOfferById,
  getOfferItemsByOfferId,
  getOffersNotifications,
  getReview,
} from "@/callAPI/swap";
import { decodedToken, getCookie } from "@/callAPI/utiles";
import Notifications from "@/app/notifications/page";
import Cart from "@/app/cart/page";

export default function ProfilePage() {
  // from data.js
  const [activeTab, setActiveTab] = useState("items");

  // Format date to a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // -------------------------------------
  const { t } = useTranslations();
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState([]);

  const [rate, setRate] = useState(0);

  const [products, setProducts] = useState([]);
  const [avatarPath, setAvatarPath] = useState("");

  const [full_name, setFullName] = useState(
    `${user?.first_name} ${user?.last_name}` || ""
  );

  const [userOffers, setUserOffers] = useState([]);
  const [notificationsLength, setNotificationsLength] = useState(0);

  const [myAvailableItems, setmyAvailableItems] = useState([]);
  const [myUnavailableItems, setmyUnavailableItems] = useState([]);

  const [showSwitchHeart, setShowSwitchHeart] = useState(false);

  const getUser = async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken(token);
      if (!id) {
        return (
          <div className="container py-10">
            <p>Please sign in to view your profile.</p>
          </div>
        );
      }
      const userData = await getUserById(id);
      setUser(userData);
    }
  };

function getCalculateAverageRating(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
let sum = 0;
for (const value of reviews) {
  sum += value;
}
console.log('sum', sum);
 return Math.round((sum / reviews.length) * 10) / 10;
}

  const handleGetBreviousRating = async (id) =>{
 const response = await getReview(id);
  console.log('response' , response)

 if (!response) {
  setRate(33)
 }
 else{
  const rates = response.map(({ rating }) =>rating);
  console.log('rates' , rates)
  const calculateAverageRating =  getCalculateAverageRating(rates)
  console.log('calculateAverageRating' , calculateAverageRating)

  setRate(calculateAverageRating)
  console.log('rate' , rate)

 }
}

  const getUserProducts = async () => {
    const userPruducts = await getProductByUserId();
    setmyUnavailableItems(
      userPruducts.filter((u) => u.status_swap === "unavailable")
    );
    setmyAvailableItems(
      userPruducts.filter((u) => u.status_swap === "available")
    );
    return userPruducts;
  };

  const getNotificationsLength = async () => {
    const notifications = await getOffersNotifications(id);
    console.log("notifications", notifications);
    setNotificationsLength(
      Array.isArray(notifications) ? notifications.length : 0
    );
  };

  //get offers

  const getOffers = async () => {
    const token = await getCookie();
    if (token) {
      let offerItems = [];
      let items = [];
      let usersSwaper = [];
      const { id } = await decodedToken(token);
      // get offers
      const offers = await getOfferById(id);

      // get offers items based offors id
      for (const offer of offers) {
        const offerItem = await getOfferItemsByOfferId(offer.id);
        offerItems.push(...offerItem);
      }

      // get items itself based offors items id
      for (const item of offerItems) {
        const product = await getProductById(item.item_id);
        items.push({ ...product });
      }

      // get user swaps based on user id and offers id
      for (const item of items) {
        const user = await getUserByProductId(item.id);
        usersSwaper.push({ ...user });
      }

      const uniqueUsers = usersSwaper.filter(
        (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
      );
      setUserOffers(offers);
      setUserSwaps(uniqueUsers);
      setSwapItems(items);

      console.log("setNotifications", offers); // Check what is returned
      console.log("offerItems", offerItems); // Check what is returned
      console.log("items", items); // Check what is returned
      console.log("usersSwaper", usersSwaper); // Check what is returned
    }
  };

  useEffect(() => {
    getNotificationsLength();
    getUser();
    getOffers();
    getUserProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  // Update avatar path and full name when user2 changes
  useEffect(() => {
    
    if (user) {
        handleGetBreviousRating(user.id)
      setAvatarPath(`http://localhost:8055/assets/${user.avatar}`);
      setFullName(`${user.first_name} ${user.last_name}`);
    }
  }, [user]);
  // -------------------------------------
  return (
    <div className="container py-10">
      {/* Go Back Link */}
      <div className="inline mb-3 ">
        <Button
          className="mb-2"
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Button>
        <h1 className="mx-2 text-3xl font-bold inline">My Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatarPath || "/placeholder.svg"}
                alt={full_name}
              />
              <AvatarFallback>{full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="capitalize">{full_name}</CardTitle>
                {user?.verified && (
                  <Verified className="h-4 w-4 text-[#49c5b6]" />
                )}
              </div>

              <CardDescription>
            
              </CardDescription>
              
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {`${user?.country}, ${user?.city}, ${user?.street}` ||
                    "No location set"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>
                  {rate
                    ? `${rate} / 5.0 Rating`
                    : "No ratings yet"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                <span>
                  {!user?.completedSwaps
                    ? "No completed swaps"
                    : `${user?.completedSwaps==0?'No': user?.completedSwaps} Completed swaps`}{" "}
                </span>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`profile/settings/editProfile`}>Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* ----------------------------------------------------------- */}

        <div className="md:col-span-2">
          <Tabs
            defaultValue="items"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Available Items</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                  {myAvailableItems.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="unavailableItems"
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                <span>Items In Offers </span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                  {myUnavailableItems.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Offers</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                  {userOffers.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <BellDot className="h-4 w-4" />
                <span>Notifications</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                  {notificationsLength}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Items</h2>
                <Button asChild size="sm">
                  <Link href="/profile/items">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Items
                  </Link>
                </Button>
              </div>

              <ItemsList
                items={myAvailableItems}
                showFilters={false}
                showbtn={false}
                showSwitchHeart={showSwitchHeart}
              />
            </TabsContent>
            {/* ---------------------------------------------- */}
            <TabsContent value="offers" className="mt-6">
              <h2 className="mb-4 text-xl font-bold">My Offers</h2>
              <Cart />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <h2 className="mb-4 text-xl font-bold">My Notifications</h2>
              <Notifications />
            </TabsContent>
            {/* ---------------------------------------------- */}

            <TabsContent value="unavailableItems" className="mt-6">
              <h2 className="mb-4 text-xl font-bold">Items On Offers</h2>
              <Card>
                <CardContent className="p-6">
                  {myUnavailableItems.length > 0 ? (
                    <ItemsList
                      items={myUnavailableItems}
                      showFilters={false}
                      showSwitchHeart={false}
                    />
                  ) : (
                    <div className="mt-6">
                      <div className="rounded-lg border p-4">
                        <p className="text-center text-sm text-muted-foreground">
                          Your have not items to get more visibility and offers.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

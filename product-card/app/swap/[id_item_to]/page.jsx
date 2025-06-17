"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeftRight,
  Package,
  Users,
  Info,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { itemsStatus } from "@/lib/data";
import Image from "next/image";
import {
  getAvailableAndUnavailableProducts,
  getImageProducts,
} from "@/callAPI/products";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { decodedToken, getCookie } from "@/callAPI/utiles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/lib/use-translations";
import { getUserById, getUserByProductId } from "@/callAPI/users";
import { addOffer, getOfferById } from "@/callAPI/swap";
import { useParams, useRouter } from "next/navigation";

export default function SwapPage() {
  const params = useParams();
  const router = useRouter();
  const id_item_to = params.id_item_to;

  const [myItems, setMyItems] = useState([]);
  const [otherItems, setOtherItems] = useState([]);
  const [selectedMyItems, setSelectedMyItems] = useState([]);
  const [selectedOtherItems, setSelectedOtherItems] = useState([]);
  const [swapHistory, setSwapHistory] = useState([]);
  const [usersOffer, setUsersOffer] = useState([]);
  const [allowedCategories, setAllowedCategories] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [disabledOffer, setDisabledOffer] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslations();

  // Fetch my items
  const getMyItems = useCallback(async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken();
      const myProductsData = await getAvailableAndUnavailableProducts(id);
      setMyItems(myProductsData);
    } else {
      router.push(`/auth/login`);
    }
  }, [router]);

  // Fetch other user's items
  const getOtherItems = useCallback(async () => {
    const otherUser = await getUserByProductId(id_item_to);
    const otherProductsData = await getAvailableAndUnavailableProducts(otherUser.id);
    setOtherItems(otherProductsData);
  }, [id_item_to]);

  // Fetch swap history
  const getSwapHistory = useCallback(async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken(token);
      const offers = await getOfferById(id);
      const users = await Promise.all(
        offers.map((swap) => getUserById(swap.to_user_id))
      );
      setUsersOffer(users);
      setSwapHistory(offers);
    }
  }, []);

  // Allowed categories logic
  useEffect(() => {
    if (selectedMyItems.length > 0) {
      const selectedCategories = selectedMyItems
        .map((itemId) => {
          const item = myItems.find((p) => p.id === itemId);
          return item?.allowed_categories;
        })
        .filter(Boolean)
        .flat();
      setAllowedCategories([...new Set(selectedCategories)]);
      setShowHint(true);
    } else {
      setAllowedCategories([]);
      setShowHint(false);
      setSelectedOtherItems([]);
    }
  }, [selectedMyItems, myItems]);

  // Fetch data on mount
  useEffect(() => {
    getMyItems();
    getOtherItems();
    getSwapHistory();
    // eslint-disable-next-line
  }, [getMyItems, getOtherItems, getSwapHistory]);

  // Selection handlers
  const handleMyItemSelect = (itemId) => {
    setSelectedMyItems((prev) => {
      const newSelection = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      if (prev.includes(itemId)) setSelectedOtherItems([]);
      return newSelection;
    });
  };

  const handleOtherItemSelect = (itemId) => {
    if (selectedMyItems.length === 0) return;
    const item = otherItems.find((p) => p.id === itemId);
    const isAllowedCategory =
      Array.isArray(item?.allowed_categories) &&
      item.allowed_categories.some((cat) => allowedCategories.includes(cat));
    if (isAllowedCategory || allowedCategories.length === 0) {
      setSelectedOtherItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    }
  };

  // Value calculation
  const getTotalValue = (items, products) => {
    return items.reduce((total, itemId) => {
      const item = products.find((p) => p.id === itemId);
      return total + parseInt(item?.price || 0);
    }, 0);
  };

  const isOtherItemSelectable = (item) => {
    if (selectedMyItems.length === 0) return false;
    return (
      (Array.isArray(item.allowed_categories) &&
        item.allowed_categories.some((cat) =>
          allowedCategories.includes(cat)
        )) ||
      allowedCategories.length === 0
    );
  };

  const mySelectedValue = getTotalValue(selectedMyItems, myItems);
  const otherSelectedValue = getTotalValue(selectedOtherItems, otherItems);
  const priceDifference = mySelectedValue - otherSelectedValue;
  const canCreateSwap = selectedMyItems.length > 0 && selectedOtherItems.length > 0;

  // Add offer handler
  const handleAddOffer = async () => {
    setDisabledOffer(true);
    try {
      const to_user = await getUserByProductId(id_item_to);
      await addOffer(
        to_user.id,
        priceDifference,
        selectedMyItems,
        selectedOtherItems,
        message,
        name
      );
      toast({
        title: t("successfully") || "Success",
        description: "Successfully created offer",
      });
      setMessage("");
      setSelectedMyItems([]);
      setSelectedOtherItems([]);
      setDisabledOffer(false);
      router.refresh();
        window.location.reload();
    } catch (error) {
      toast({
        title: t("faildSwap") || "Failed Swap",
        description: "Invalid swap or not logged in. Please try again.",
        variant: "destructive",
      });
      setDisabledOffer(false);
        window.location.reload();
    }
  };

  // Price difference display
  const handlePriceDifference = (userId, cash) => {
    const { id } = decodedToken();
    if (userId === id) {
      if (cash > 0) return `You pay: ${Math.abs(Math.ceil(cash))} LE`;
      if (cash < 0) return `You get: ${Math.abs(Math.ceil(cash))} LE`;
      return `The price is equal`;
    } else {
      if (cash < 0) return `You pay: ${Math.abs(Math.ceil(cash))} LE`;
      if (cash > 0) return `You get: ${Math.abs(Math.ceil(cash))} LE`;
      return `The price is equal`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                SwapSpace
              </Link>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Swap
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Create a Swap</h1>
          <p className="text-muted-foreground">
            Select items from your collection first, then choose matching
            items from other users
          </p>
        </div>
        {/* ------------------------- */}
        <Tabs defaultValue="swap">
          <TabsList className="mb-8">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="history">{t("swapHistory")}</TabsTrigger>
          </TabsList>

          <TabsContent value="swap">
            {/* Category Hint */}
            {showHint && allowedCategories.length > 0 && (
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Available categories for swapping:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {allowedCategories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selection Rules Info */}
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Swap Rules:</p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        • First select your items to see available categories
                      </li>
                      <li>
                        • You can only select items from matching categories
                      </li>
                      <li>
                        • Unchecking your items will clear other selections
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Swap Summary */}
            {canCreateSwap && (
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedMyItems.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Your Items
                      </div>
                      <div className="text-lg font-semibold">
                        {mySelectedValue}LE
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ArrowLeftRight className="h-8 w-8 text-primary" />
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedOtherItems.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Their Items
                      </div>
                      <div className="text-lg font-semibold">
                        {otherSelectedValue}LE
                      </div>
                    </div>
                  </div>

                  {/* Price Difference */}
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Price Difference
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        priceDifference > 0
                          ? "text-green-600"
                          : priceDifference < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {priceDifference > 0 ? "+" : ""}
                      {priceDifference}LE
                      {priceDifference > 0 && (
                        <span className="text-sm ml-1">(You gain)</span>
                      )}
                      {priceDifference < 0 && (
                        <span className="text-sm ml-1">(You pay extra)</span>
                      )}
                      {priceDifference === 0 && (
                        <span className="text-sm ml-1">(Equal value)</span>
                      )}
                    </div>
                  </div>

{/* Swap name */}
                    <div className="flex space-x-3 my-2">
                        <Input
                          placeholder="Take name for deel is optionally"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1"
                        />
                      </div>

                  {/* Chat Section */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Chat with Swap Partners
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type your message for the swap partners"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <div className="text-center">
                    <Button
                      size="lg"
                      className="px-8"
                      onClick={handleAddOffer}
                      disabled={disabledOffer}
                    >
                      <ArrowLeftRight className="h-4 w-4" /> Swap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* My Products */}
              {myItems.length !==0 ?(<div>
                <div className="flex items-center mb-6">
                  <Package className="h-6 w-6 mr-3 text-primary" />
                  <h2 className="text-2xl font-bold">Your Products</h2>
                  <Badge variant="secondary" className="ml-3">
                    {selectedMyItems.length} selected
                  </Badge>
                </div>

                <div className="space-y-4">
                  {myItems.map((product) => (
                    <Card
                      key={product.id}
                      className={`transition-all duration-200 ${
                        selectedMyItems.includes(product.id)
                          ? "ring-2 ring-primary shadow-lg"
                          : "hover:shadow-md"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center">
                            <Checkbox
                              checked={selectedMyItems.includes(product.id)}
                              onCheckedChange={() =>
                                handleMyItemSelect(product.id)
                              }
                              className="mr-3"
                            />
                          </div>
                          <ItemCard {...product} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>):(
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    You haven't  any Items yet.
                  </p>
                  <Button 
                   onClick={() => router.push('/profile/settings/editItem/new')}
                  className="mt-4 bg-primary-orange text-white hover:bg-deep-orange">
                    Add New Item
                  </Button>
                </div>
              )}
              

              {/* Other Users' Products */}
              { otherItems.length!==0 ? 
              (
              <div>
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 mr-3 text-primary" />
                  <h2 className="text-2xl font-bold">Available Products</h2>
                  <Badge variant="secondary" className="ml-3">
                    {selectedOtherItems.length} selected
                  </Badge>
                </div>

                <div className="space-y-4">
                  {otherItems.map((product) => {
                    const isSelectable = isOtherItemSelectable(product);
                    const isSelected = selectedOtherItems.includes(product.id);

                    return (
                      <Card
                        key={product.id}
                        className={`transition-all duration-200 ${
                          isSelected
                            ? "ring-2 ring-primary shadow-lg"
                            : isSelectable
                            ? "hover:shadow-md"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleOtherItemSelect(product.id)
                                }
                                disabled={!isSelectable}
                                className="mr-3"
                              />
                            </div>
                            <ItemCard {...product} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>):(
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    he hasn't made any Items yet.
                  </p>
                  <Button 
                  onClick={() => router.push('/products')}
                  className="mt-4 bg-primary-orange text-white hover:bg-deep-orange">
                    Start Swapping
                  </Button>
                </div>
              )}
              
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">{t("swapHistory")}</h2>
              {swapHistory.length > 0 ? (
                <div className="space-y-4">
                  {swapHistory.map((swap) => (
                    <Card key={swap.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(swap?.date_created)
                                .toISOString()
                                .split("T")[0]}
                            </p>
                            <h3 className="font-medium">
                              Swap with:{" "}
                              {usersOffer.find(
                                (u) => u.id === swap.to_user_id
                              )?.first_name || `Not Name`}
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                  swap.status_offer === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : swap.status_offer === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                    : "bg-red-600 text-yellow-800 dark:bg-red-500 dark:text-yellow-100"
                                }`}
                              >
                                {swap.status_offer}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:items-end">
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">
                                {handlePriceDifference(
                                  swap.from_user_id,
                                  swap.cash_adjustment
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    You haven't made any swaps yet.
                  </p>
                  <Button className="mt-4 bg-primary-orange text-white hover:bg-deep-orange">
                    Start Swapping
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ItemCard component
const ItemCard = ({
  id,
  name,
  description,
  price,
  images,
  allowed_categories,
  status_swap,
  category,
}) => {
  const [bigImage, setBigImage] = useState("");
  useEffect(() => {
    const getDataImage = async () => {
      if (images) {
        const images2 = await getImageProducts(images);
        setBigImage(images2[0]?.directus_files_id || "");
      }
    };
    getDataImage();
  }, [images]);

  const getConditionColor = (itemsStatus) => {
    switch (itemsStatus) {
      case "new":
      case "like-new":
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "old":
        return "bg-red-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Image
        src={
          bigImage
            ? `http://localhost:8055/assets/${bigImage}`
            : "/placeholder.svg"
        }
        alt={name}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        width={80}
        height={80}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">{category}</Badge>
          <Badge className={getConditionColor(status_swap)}>
            {status_swap}
          </Badge>
          <Separator />
          <Badge>Allow To:</Badge>
          {allowed_categories &&
            allowed_categories.length > 0 &&
            allowed_categories.map((cat, idx) => (
              <Badge key={idx} variant="outline" className="ml-1">
                {cat}
              </Badge>
            ))}
        </div>
        <div className="text-xl font-bold text-primary">{price} LE</div>
      </div>
    </>
  );
};
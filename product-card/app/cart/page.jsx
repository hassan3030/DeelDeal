"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductById, getImageProducts } from "@/callAPI/products";
import {
  getOfferById,
  getOfferItemsByOfferId,
  deleteOfferById,
  deleteOfferItemsById,
} from "@/callAPI/swap";
import { getUserById } from "@/callAPI/users";
import { getCookie, decodedToken } from "@/callAPI/utiles";
import { useTranslations } from "@/lib/use-translations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingCart,
  Calendar,
  Trash2,
  Handshake,
  RefreshCwOff,
  ShieldCheck,
  Loader,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const Cart = () => {
  const [offers, setOffers] = useState([]);
  const [swapItems, setSwapItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cashAdjustment, setCashAdjustment] = useState(null);                         
  const [totalCash, setTotalCash] = useState('');                         
  const [pendingDelete, setPendingDelete] = useState({
    idItem: null,
    idOffer: null,
    owner: null,
    itemIdItslfe: null,
  });

  const router = useRouter();
  const { t } = useTranslations();

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getOffers = useCallback(async () => {
    const token = await getCookie();
    if (!token) return;

    let offerItems = [];
    let items = [];
    let usersSwaper = [];
    const { id } = await decodedToken();

    const offers = await getOfferById(id);

    for (const offer of offers) {
      const offerItem = await getOfferItemsByOfferId(offer.id);
      const user_from = await getUserById(offer.from_user_id);
      const user_to = await getUserById(offer.to_user_id);
      usersSwaper.push(user_from, user_to);
      offerItems.push(...offerItem);
    }

    for (const item of offerItems) {
      const product = await getProductById(item.item_id);
      items.push({ ...product , 
        offer_item_id: item.id,
         offered_by: item.offered_by ,
        offer_id: item.offer_id,
      });
    }

    const uniqueUsers = Array.from(
      new Map(usersSwaper.map((user) => [user.id, user])).values()
    );

    // const mergedItems = items.map((item) => {
    //   const offerItem = offerItems.find((oi) => oi.item_id === item.id);
    //   return {
    //     ...item,
    //     offered_by: offerItem ? offerItem.offered_by : null,
    //     offer_id: offerItem ? offerItem.offer_id : null,
    //     // offer_item: offerItem ? offerItem.id : null,
    //   };
    // });

    setOffers(offers);
    setUserSwaps(uniqueUsers);
    setSwapItems(items);
     console.log('swapItems' , items)
    setItemsOffer(offerItems);
  }, []);

  useEffect(() => {
    getOffers();
    updateCashAdjustmentAfterRemove()
    console.log('swapItems' , swapItems)
  }, [getOffers]);

  const handleDeleteSwap = async (swapId) => {
    try {
      await deleteOfferById(swapId);
      toast({
        title: t("successfully") || "Successfully",
        description: "Swap deleted successfully",
      });
      setShowDeleteDialog(false);
      getOffers();
      router.refresh();
    } catch (err) {
      toast({
        title: t("error") || "Error",
        description: "Failed to delete swap",
        variant: "destructive",
      });
    }
  };

const updateCashAdjustmentAfterRemove = (offerId) => {
  // Find all items for this offer
  const offerItems = swapItems.filter(item => item.offer_id === offerId);

  // Calculate total price for my items and their items
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return;

  const myItems = offerItems.filter(item => item.offered_by === offer.from_user_id);
  const theirItems = offerItems.filter(item => item.offered_by !== offer.from_user_id);
  
  const myTotal = myItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const theirTotal = theirItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  // Update cashAdjustment state (if you want to keep it per-offer, use an object)
  setCashAdjustment(myTotal - theirTotal);
};

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

  // const handleDeleteItem = async (idItem, idOffer, owner , itemIdItslfe) => {
  //   try {
  //     updateCashAdjustmentAfterRemove(idOffer);
  //     const OfferItems = await getOfferItemsByOfferId(idOffer);
  //     const counterOwnerItems = OfferItems.filter(
  //       (item) => item.offered_by === owner && item.offer_id === idOffer
  //     ).length;

  //     if (counterOwnerItems > 1) {
  //       const deleteOfferItems = await deleteOfferItemsById(idItem , itemIdItslfe , cashAdjustment , idOffer );
  //       if (deleteOfferItems) {
  //         toast({
  //           title: t("successfully") || "Successfully",
  //           description: "Item deleted successfully",
  //         });
  //         getOffers();
  //       } else {
  //         toast({
  //           title: t("error") || "Error",
  //           description: "Failed to delete item",
  //           variant: "destructive",
  //         });
  //          router.refresh();
  //       }
  //     } else {
  //       setPendingDelete({ idItem, idOffer, owner ,itemIdItslfe });
  //       setShowDeleteDialog(true);
  //       toast({
  //           title: t("successfully") || "Successfully",
  //           description: "Item deleted successfully",
  //         });
  //     }
  //   } catch (err) {
  //     toast({
  //       title: t("error") || "Error",
  //       description: "Failed to delete item",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // Placeholder for completed swap logic
 // In your Cart component
const handleDeleteItem = async (idItem, idOffer, owner, itemIdItself) => {
  try {
    // Remove the item from your local swapItems state first (if needed)
    // Then recalculate cashAdjustment for this offer
    const offerItems = swapItems.filter(item => item.offer_id === idOffer && item.id !== itemIdItself);
    const offer = offers.find(o => o.id === idOffer);
    const myItems = offerItems.filter(item => item.offered_by === offer.from_user_id);
    const theirItems = offerItems.filter(item => item.offered_by !== offer.from_user_id);
    const myTotal = myItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const theirTotal = theirItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const newCashAdjustment = myTotal - theirTotal;

    // Now call the API with the new value
    if(myItems.length > 1) {
          await deleteOfferItemsById(idItem, itemIdItself, newCashAdjustment, idOffer);
    }else{
      setPendingDelete({ idItem, idOffer, owner, itemIdItslfe: itemIdItself });
      setShowDeleteDialog(true);
    }

    // Refresh offers/items from backend
    getOffers();
  } catch (err) {
    // handle error
  }
};
 
  const handleCompletedSwap = async (swapId) => {
    toast({
      title: "Not implemented",
      description: "Complete swap logic not implemented.",
    });
  };

  return (
    <>
      {/* Delete Swap Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Swap</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this swap?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleDeleteSwap(pendingDelete.idOffer);
                }}
              >
                Delete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-8 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-background flex items-center">
                <ShoppingCart className="mr-3 h-8 w-8" />
                My Swaps Cart
                {offers?.length > 0 && (
                  <Badge className="ml-3 bg-red-500 text-white">
                    {offers?.length || t("notFoundSwaps")}
                  </Badge>
                )}
              </h1>
              <p className="text-background/90 mt-2">
                Manage all your swap listings
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
            {["pending", "accepted", "rejected", "completed"].map((status) => {
              const icons = {
                pending: <Loader className="h-8 w-8 mx-auto mb-2 text-primary" />,
                accepted: <Handshake className="h-8 w-8 mx-auto mb-2 text-primary" />,
                rejected: <RefreshCwOff className="h-8 w-8 mx-auto mb-2 text-primary" />,
                completed: <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-primary" />,
              };
              const count = offers.filter((offer) => offer.status_offer === status).length;
              if (!count) return null;
              return (
                <Card key={status}>
                  <CardContent className="p-6 text-center">
                    {icons[status]}
                    <div className="text-2xl font-bold">
                      {count || t("notFoundSwaps")}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {status} Swaps {count ? "" : 0}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Swaps List */}
          {[...offers]
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((offer, index) => (
              <Card key={offer.id} className="overflow-hidden my-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Swap: {index + 1}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["pending", "accepted"].includes(offer.status_offer) && (
                          <Badge
                            variant="outline"
                            className={getStatusColor(offer.status_offer)}
                          >
                            {offer.status_offer}
                          </Badge>
                        )}
                        {offer.status_offer === "completed" || offer.status_offer === "pending"?   (
                        
                      <span className="text-sm text-muted-foreground">
                                {handlePriceDifference(
                                  offer.from_user_id,
                                  offer.cash_adjustment
                                )}
                              </span>
                        )
                      :
                      null
                      }

                      </div>
                    </div>
                    {!["rejected", "completed"].includes(offer.status_offer) && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          My items:{" "}
                          {
                            itemsOffer.filter(
                              (u) =>
                                u.offered_by === offer.from_user_id &&
                                u.offer_id === offer.id
                            ).length
                          }{" "}
                          | Their items:{" "}
                          {
                            itemsOffer.filter(
                              (u) =>
                                u.offered_by !== offer.from_user_id &&
                                u.offer_id === offer.id
                            ).length
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {["pending", "accepted"].includes(offer.status_offer) ? (
                    <>
                      {/* My Items */}
                      <div>
                        <h4 className="font-semibold mb-2">My Items</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {swapItems
                            .filter(
                              (u) =>
                                u.offered_by === offer.from_user_id &&
                                u.offer_id === offer.id
                            )
                            .map((item) => (
                              <CardItemSwap
                                key={item.id}
                                {...item}
                                deleteItem={() =>
                                  handleDeleteItem(
                                    item.offer_item_id,
                                    offer.id,
                                    item.offered_by,
                                    item.id
                                  )
                                }
                              />
                            ))}
                        </div>
                      </div>
                      {/* Their Items */}
                      <div>
                        <h4 className="font-semibold mb-2">Their Items</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {swapItems
                            .filter(
                              (u) =>
                                u.offered_by !== offer.from_user_id &&
                                u.offer_id === offer.id
                            )
                            .map((item) => (
                              <CardItemSwap
                                key={item.id}
                                {...item}
                                deleteItem={() =>
                                  handleDeleteItem(
                                     item.offer_item_id,
                                    offer.id,
                                    item.offered_by,
                                    item.id
                                  )
                                }
                              />
                            ))}
                        </div>
                      </div>
                    </>
                  ) : offer.status_offer === "completed" ? (
                    <div className="text-center text-green-600">
                      <ShieldCheck className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="text-xl font-semibold mb-2">
                        Swap Completed Successfully!
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Thank you for completing the swap.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-red-600">
                      <Trash2 className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="text-xl font-semibold mb-2">Swap Rejected</h3>
                      <p className="text-muted-foreground mb-4">
                        The swap was rejected by you.
                      </p>
                    </div>
                  )}
                  <Separator className="my-4" />

                  {/* Swap Details */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-1">
                        {new Date(offer.date_created).toISOString().split("T")[0]}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              userSwaps.find((u) => u.id === offer.to_user_id)
                                ?.avatar
                                ? `http://localhost:8055/assets/${
                                    userSwaps.find((u) => u.id === offer.to_user_id)
                                      ?.avatar
                                  }`
                                : "/placeholder.svg"
                            }
                            alt={
                              userSwaps.find((u) => u.id === offer.to_user_id)
                                ?.first_name ||
                              t("account") ||
                              "Unknown"
                            }
                          />
                          <AvatarFallback>
                            {userSwaps
                              .find((u) => u.id === offer.to_user_id)
                              ?.first_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col ml-2">
                        <span className="px-1 text-gray-400">
                          {userSwaps.find((u) => u.id === offer.to_user_id)?.first_name || ""}
                        </span>
                        <span className="px-1 text-gray-400">
                          {userSwaps.find((u) => u.id === offer.to_user_id)?.email || ""}
                        </span>
                      </div>
                    </div>
                    {offer.status_offer === "pending" ? (
                      <div className="flex items-center text-sm ">
                        <span
                          className="text-muted-foreground text-red-600 hover:scale-110 cursor-pointer"
                          onClick={() => {
                            setPendingDelete({
                              idItem: null,
                              idOffer: offer.id,
                              owner: null,
                            });
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="inline h-4 w-4 align-middle mr-2 text-muted-foreground text-red-600 hover:scale-110 cursor-pointer" />
                          Delete Swap
                        </span>
                      </div>
                    ) : null}
                    {offer.status_offer === "accepted" ? (
                      <div className="flex items-center text-sm ">
                        <span
                          className="text-muted-foreground text-red-600 hover:scale-110 cursor-pointer"
                          onClick={() => handleCompletedSwap(offer.id)}
                        >
                          <Trash2 className="inline h-4 w-4 mr-2 text-muted-foreground text-red-600 hover:scale-110 cursor-pointer" />
                          Complete Swap
                        </span>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          {offers.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No swaps yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first swap listing
              </p>
              <Link href={"/products"}>
                <Button>Create New Swap</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

export const CardItemSwap = ({
  id,
  name,
  description,
  price,
  status_item,
  images,
  deleteItem,
}) => {
  const router = useRouter();
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

  const handleView = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <Card key={id} className="overflow-hidden">
      <div className="h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <img
          src={
            bigImage
              ? `http://localhost:8055/assets/${bigImage}`
              : "/placeholder.svg"
          }
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-1">{name}</h4>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {description}
        </p>
        <div className="flex justify-between items-center mb-3">
          <Badge variant="outline" className="text-xs">
            {status_item}
          </Badge>
          <span className="font-bold text-primary text-sm">{price}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleView(id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={deleteItem}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
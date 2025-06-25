"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductById, getImageProducts } from "@/callAPI/products";
import {
  getOfferById,
  getOfferItemsByOfferId,
  deleteOfferById,
  deleteOfferItemsById,
  completedOfferById,
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
  Box,
  CheckCheck,
  BadgeX,
  Scale,
  CircleDot,
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
import SwapRating from "@/components/reviews";

const Cart = () => {
  const [offers, setOffers] = useState([]);
  const [swapItems, setSwapItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cashAdjustment, setCashAdjustment] = useState(null);
  const [totalCash, setTotalCash] = useState("");
  const [showComleteDialog, setShowComleteDialog] = useState(false);
  const [myUserId, setMyUserId] = useState();

  const [pendingDelete, setPendingDelete] = useState({
    idItem: null,
    idOffer: null,
    owner: null,
    itemIdItslfe: null,
  });
  const [pendingCompleted, setPendingCompleted] = useState({
    idOffer: null,
    owner: null,
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
      items.push({
        ...product,
        offer_item_id: item.id,
        offered_by: item.offered_by,
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
    console.log("swapItems", items);
    setItemsOffer(offerItems);
  }, []);

  // const handleDeleteSwap = async (swapId) => {
  //   try {
  //   await deleteOfferById(swapId);
  //   toast({
  //     title: t("successfully") || "Successfully",
  //     description: "Swap deleted successfully",
  //   });
  //   setShowDeleteDialog(false);
  //   getOffers();
  //   router.refresh();
  // } catch (err) {
  //   toast({
  //     title: t("error") || "Error",
  //     description: "Failed to delete swap",
  //     variant: "destructive",
  //   });
  // }
  // };

  const updateCashAdjustmentAfterRemove = (offerId) => {
    // Find all items for this offer
    const offerItems = swapItems.filter((item) => item.offer_id === offerId);

    // Calculate total price for my items and their items
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    const myItems = offerItems.filter(
      (item) => item.offered_by === offer.from_user_id
    );
    const theirItems = offerItems.filter(
      (item) => item.offered_by !== offer.from_user_id
    );

    const myTotal = myItems.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    );
    const theirTotal = theirItems.reduce(
      (sum, item) => sum + (parseFloat(item.price) || 0),
      0
    );
    // Update cashAdjustment state (if you want to keep it per-offer, use an object)
    setCashAdjustment(myTotal - theirTotal);
  };

  const handlePriceDifference = (userId, cash) => {
    const { id } = decodedToken();
    if (userId === id) { 
      if (cash > 0) return `${t("Youpay")||"You pay"}: ${Math.abs(Math.ceil(cash))} ${t("LE")||"LE"}`;
      if (cash < 0) return   `${t("Youget")||"You get"}: ${Math.abs(Math.ceil(cash))} ${t("LE")||"LE"}`;
      return `${t("Thepriceisequal")||"The price is equal"}`;
    } else {
      if (cash < 0) return `${t("Youpay")||"You pay"}: ${Math.abs(Math.ceil(cash))} ${t("LE")||"LE"}`;
      if (cash > 0) return `${t("Youget")||"You get"}: ${Math.abs(Math.ceil(cash))} ${t("LE")||"LE"}`;
      return  `${t("Thepriceisequal")||"The price is equal"}`;
    }
  };

  const handleDeleteItem = async (offerItemId, itemId) => {
    // Find the offer for this item
    const item = swapItems.find((itm) => itm.id === itemId);
    if (!item) return;

    // Count my items in this offer
    const myItems = swapItems.filter(
      (itm) =>
        itm.offer_id === item.offer_id && itm.offered_by === item.offered_by // your user id
    );

    if (myItems.length > 1) {
      // Delete only the item
      try {
        await deleteOfferItemsById(offerItemId, itemId);
        toast({
          title: t("successfully") || "Successfully",
          description: t("Itemdeletedfromswapsuccessfully")|| "Item deleted from swap successfully",
        });
        getOffers();
      } catch (err) {
        toast({
          title: t("error") || "Error",
          description: t("Failedtodeleteitem")||"Failed to delete item",
          variant: "destructive",
        });
      }
    } else {
      // Only one item left, ask to delete the whole swap
      setPendingDelete({
        idItem: offerItemId,
        idOffer: item.offer_id,
        owner: item.offered_by,
        itemIdItslfe: itemId,
      });
      setShowDeleteDialog(true);
    }
  };

  //  completed swap
  const getCompleteSwap = async (offerId) => {
    const completeSwap = await completedOfferById(offerId);
    if (!completeSwap) {
      toast({
        title: t("error") || "Error",
        description:  t("Failedtocompleteswap")|| "Failed to complete swap",
        variant: "destructive",
      });
    } else {
      toast({
        title: t("successfully") || "Successfully",
        description: t("Swapcompletedsuccessfully")||  "Swap completed successfully",
      });
      router.refresh();
    }
  };

  const handleDeleteSwap = async (swapId) => {
    try {
      await deleteOfferById(swapId);
      toast({
        title: t("successfully") || "Successfully",
        description: t("Swapdeletedsuccessfully")||  "Swap deleted successfully",
      });
      setShowDeleteDialog(false);
      getOffers();
      router.refresh();
    } catch (err) {
      toast({
        title: t("error") || "Error",
        description: t("Failedtodeleteswap")|| "Failed to delete swap",
        variant: "destructive",
      });
    }
  };
const fetchUserId = async () => {
          const { id } = await decodedToken();
          setMyUserId(id);
        };
        
  useEffect(() => {
     fetchUserId()
    getOffers();
    updateCashAdjustmentAfterRemove();
    console.log("swapItems", swapItems);
  }, [getOffers]);

  return (
    <>
      {/* Delete Swap Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("DeleteSwap")|| "Delete Swap" }</DialogTitle>
            <DialogDescription>
              {t("Areyousureyouwanttodeletethisswap")|| "  Are you sure you want to delete this swap?" }
            
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="destructive"
                className="mx-2"
                onClick={async () => {
                  await handleDeleteSwap(pendingDelete.idOffer);
                }}
              >
                {t("delete")|| "Delete" }
                
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                 className="mx-2"
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                  {t("Cancel")|| "Cancel" }
                
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Swap Dialog */}
      <Dialog open={showComleteDialog} onOpenChange={setShowComleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("CompleteSwap")|| "Complete Swap" }</DialogTitle>
            <DialogDescription>
              <ul>
                <li>
                  {t("AreyousureyouwanttoCompletethisswap")|| "Are you sure you want to Complete this swap?" } </li>
                <li>
                 {t("Ifyoucompletetheswapyouwillnotbeabletoundothisaction")|| "If you complete the swap,you will not be able to undo this action." } 
                </li>
                <li>{t("Chatwillbeclosed.")|| "Chat will be closed." }</li>
                <li>{t("Itemswillberemoved")|| "Items will be removed." }</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={async () => {
                  await getCompleteSwap(pendingCompleted.idOffer);
                  setShowComleteDialog(false);
                  router.refresh();
                }}
              >
                {t("Complete")|| "Complete" }
                
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => setShowComleteDialog(false)}
              >
                 {t("Cancel")|| "Cancel" }
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen bg-background">
        {/* ...header and summary... */}

        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* --- Swap Summary Stats --- */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.length === 0 ?   t("no")|| "No"  : offers.length}
              </span>
              <Box className="" />{" "}
              <span className="text-xs text-muted-foreground">{t("AllSwaps")|| "All Swaps" }</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "pending").length === 0
                  ? t("no")|| "No" 
                  : offers.filter((o) => o.status_offer === "pending").length}
              </span>
              <Loader />
              <span className="text-xs text-muted-foreground">{t("pending")|| "Pending" }</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "accepted").length ===
                0
                  ? t("no")|| "No" 
                  : offers.filter((o) => o.status_offer === "accepted").length}
              </span>
              <Handshake />
              <span className="text-xs text-muted-foreground">{t("accepted")|| "Accepted" }</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "completed").length ===
                0
                  ? t("no")|| "No" 
                  : offers.filter((o) => o.status_offer === "completed").length}
              </span>
              <CheckCheck />
              <span className="text-xs text-muted-foreground">{t("completed")|| "Completed" }</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "rejected").length ===
                0
                  ?t("no")|| "No" 
                  : offers.filter((o) => o.status_offer === "rejected").length}
              </span>
              <BadgeX />
              <span className="text-xs text-muted-foreground">{t("rejected")|| "Rejected" }</span>
            </div>
          </div>
          {/* --- End Swap Summary Stats --- */}

          {/* ...existing code for offers list... */}
        </div>
        <div className="max-w-7xl mx-auto px-4 py-">
          {/* ...summary stats... */}
          {[...offers]
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((offer, index) => (
              <Card
                key={offer.id}
                id={offer.id}
                className="overflow-hidden my-2"
              >
                <CardHeader>
                  {/* ...header content... */}
                  {!["rejected", "completed"].includes(offer.status_offer) && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                       {t("Myitems")|| "My items" } :{" "}
                        {
                          itemsOffer.filter(
                            (u) =>
                              u.offered_by === offer.from_user_id &&
                              u.offer_id === offer.id
                          ).length
                        }{" "}
                        |    {t("Theiritems")|| "Their items" }:{" "}
                        {
                          itemsOffer.filter(
                            (u) =>
                              u.offered_by !== offer.from_user_id &&
                              u.offer_id === offer.id
                          ).length
                        }
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 md:mt-0 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {offer.date_created
                          ? new Date(offer.date_created).toLocaleString()
                          : ""}
                      </div>

                      <div
                        className={`text-xs mt-1
          flex items-center gap-1  
        ${
          offer.cash_adjustment > 0
            ? "text-green-500"
            : offer.cash_adjustment < 0
            ? "text-red-500"
            : "text-gray-500"
        }`}
                      >
                        <Scale className="w-3 h-3" />
                        {offer.cash_adjustment
                          ? `${t("CashAdjustment")|| "Cash Adjustment" }: ${handlePriceDifference(
                              offer.from_user_id,
                              offer.cash_adjustment
                            )}`
                          : ""}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 capitalize">
                        <CircleDot className="w-3 h-3" />
                        {t("Offerstate")|| "Offer statet" } : {t(offer.status_offer)}
                      </div>
                      {offer.name ? (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1capitalize">
                              {t("OfferName")|| "Offer Name" } : {offer.name}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {["pending", "accepted"].includes(offer.status_offer) ? (
                    <>
                      {/* My Items */}
                      <div>
                        <h4 className="font-semibold mb-2">{t("Myitems")|| "My items" }</h4>
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
                                  handleDeleteItem(item.offer_item_id, item.id)
                                }
                              />
                            ))}
                        </div>
                      </div>
                      {/* Their Items */}
                      <div>
                        <h4 className="font-semibold mb-2"> {t("Theiritems")|| "Their Items" }</h4>
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
                                  handleDeleteItem(item.offer_item_id, item.id)
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
                       {t("SwapCompletedSuccessfully")|| "Swap Completed Successfully!" }
                      </h3>
                      <p className="text-muted-foreground mb-4">
                          {t("Thankyouforcompletingtheswap")|| " Swap Completed Successfully!" }
                       
                      </p>

                     

                        <p className="text-muted-foreground mb-4">
{t("Contactphone")|| "Contact phone" }:{" "}
  {(() => {
    // Find the other user in the swap (not me)
    const userToContact =
      userSwaps.find(
        (u) =>
          u.id === (myUserId === offer.from_user_id ? offer.to_user_id : offer.from_user_id)
      ) || {};

    return userToContact.phone_number ||  t("Nophoneavailable")|| "No phone available" ;
  })()}
</p>

                      {(() => {
                        // Find the user to rate (the other swap partner)
                        const userToRate =
                          userSwaps.find(
                            (u) =>
                              u.id ===
                              (myUserId === offer.from_user_id
                                ? offer.to_user_id
                                : offer.from_user_id)
                          ) || {};

                        return (
                          <SwapRating
                            from_user_id={myUserId}
                            to_user_id={userToRate.id}
                            offer_id={offer.id}
                            userName={`${userToRate.first_name || ""} ${
                              userToRate.last_name || ""
                            }`}
                            userAvatar={
                              userToRate.avatar
                                ? `http://localhost:8055/assets/${userToRate.avatar}`
                                : "/placeholder.svg"
                            }
                          />
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center text-red-600">
                      <Trash2 className="h-8 w-8 mx-auto mb-2" />
                      <h3 className="text-xl font-semibold mb-2">
                        {t("SwapRejected")|| " Swap Rejected" }
                       
                      </h3>
                      <p className="text-muted-foreground mb-4">
                       {t("Theswapwasrejectedbyyou")|| "The swap was rejected by you." } 
                      </p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  {/* ...swap details... */}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 border-t pt-4">
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={
                            `http://localhost:8055/assets/${
                              userSwaps.find((u) => u.id === offer.to_user_id)
                                ?.avatar
                            }` || "/placeholder.svg"
                          }
                          alt={
                            userSwaps.find((u) => u.id === offer.to_user_id)
                      
                              ?.first_name ||  t("User")|| "User"
                          }
                        />
                        <AvatarFallback>
                          {userSwaps.find((u) => u.id === offer.to_user_id)
                            ?.first_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-semibold text-base capitalize">
                          {userSwaps.find((u) => u.id === offer.to_user_id)
                            ?.first_name || t("User")|| "User"}
                        </div>
                      </div>
                    </div>
                    {/*  pending swap  */}
                    {offer.status_offer === "pending" ? (
                      <div className="flex items-center text-sm mt-2 md:mt-0">
                        <span
                          className="text-muted-foreground text-red-600 hover:scale-110 cursor-pointer flex items-center gap-1"
                          onClick={() => {
                            setPendingDelete({
                              idItem: null,
                              idOffer: offer.id,
                              owner: null,
                            });
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="inline h-4 w-4 align-middle mr-1" />
                         {t("DeleteSwap")|| "Delete Swap" }
                        </span>
                      </div>
                    ) : null}

                    {offer.status_offer === "accepted" ? (
                      <div className="flex items-center text-sm mt-2 md:mt-0">
                        <Button
                          // variant="destructive"
                          size="sm"
                          onClick={() => {
                            setPendingCompleted({
                              idOffer: offer.id,
                              owner: null,
                            });
                            setShowComleteDialog(true);
                          }}
                          className="flex items-center gap-1"
                        >
                          <ShieldCheck className="h-4 w-4" />
                         {t("CompleteSwap")|| "Complete Swap" }
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  {/*  pending swap  */}

                  {/* --- End footer --- */}
                </CardContent>
              </Card>
            ))}
          {/* ...empty state... */}
          {/* Empty state */}
          {offers.length === 0 && (
            <Card className="p-12 text-center mt-8">
              <h3 className="text-xl font-semibold mb-2">{t("NoCart")|| "No Cart" }</h3>
              <p className="text-muted-foreground">
                {t("YoureallcaughtupNewAddincartwillappearhere")|| "You're all caught up! New Add in cart will appear here." }
                
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/products")}
              >
                    {t("MakeSwap")|| "Make Swap" }
                
              </Button>
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
  const { t } = useTranslations();

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
            {t(status_item) || status_item}
          </Badge>
          <span className="font-bold text-primary text-sm">  {t(price) || price}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleView(id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            {t("view") || "View"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={deleteItem}
          >
            <Trash2 className="h-3 w-3 mr-1" />
                {t("delete") || "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

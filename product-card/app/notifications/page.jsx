"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getOfferItemsByOfferId,
  deleteOfferById,
  deleteOfferItemsById,
  getOffersNotifications,
  getAllMessage,
  addMessage,
  acceptedOfferById ,
  completedOfferById
} from "@/callAPI/swap";
import { getUserById } from "@/callAPI/users";
import { getCookie, decodedToken } from "@/callAPI/utiles";
import { getProductById, getImageProducts } from "@/callAPI/products";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar, Trash2, Eye, ShieldCheck, MessageCircle, Send, MapPin, Star, ArrowRightLeft , Handshake, Scale, BadgeX, CheckCheck, Loader, Box, BellDot   } from "lucide-react";
import {  } from 'lucide-react';
import { toast } from "sonner";
import { useTranslations } from "@/lib/use-translations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Notifications = () => {
  const [offers, setOffers] = useState([]);
  const [swapItems, setSwapItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComleteDialog, setShowComleteDialog] = useState(false);
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
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [myUserId, setMyUserId] = useState();

  const router = useRouter();
  const { t } = useTranslations();

  // Fetch notifications where I am the to_user_id
  const getNotifications = useCallback(async () => {
    const token = await getCookie();
    if (!token) return;

    let offerItems = [];
    let items = [];
    let usersSwaper = [];
    const { id } = await decodedToken();

    const offers = await getOffersNotifications(id);

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
        user_id: product.user_id,
      });
    }

    const uniqueUsers = Array.from(
      new Map(usersSwaper.map((user) => [user.id, user])).values()
    );

    setOffers(offers);
    setUserSwaps(uniqueUsers);
    setSwapItems(items);
    setItemsOffer(offerItems);
  }, []);

  // Chat
  const handleGetMessages = useCallback(async () => {
    const messages = await getAllMessage();
    setChatMessages(messages);
  }, []);

  const handleSendMessage = async (to_user_id, offer_id) => {
    if (!message.trim()) return;
    await addMessage(message.trim(), to_user_id, offer_id);
    setMessage("");
    handleGetMessages();
  };

  const handleDeleteItem = async (offerItemId, itemId) => {
    // Find the offer for this item
    const item = swapItems.find((itm) => itm.id === itemId);
    if (!item) return;

    // Count their items in this offer (since you are to_user_id)
    const theirItems = swapItems.filter(
      (itm) =>
        itm.offer_id === item.offer_id && itm.offered_by === item.offered_by
    );

    if (theirItems.length > 1) {
      try {
        await deleteOfferItemsById(offerItemId, itemId);
        toast({
          title: t("successfully") || "Successfully",
          description: "Item deleted from swap successfully",
        });
        getNotifications();
      } catch (err) {
        toast({
          title: t("error") || "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      }
    } else {
      setPendingDelete({
        idItem: offerItemId,
        idOffer: item.offer_id,
        owner: item.offered_by,
        itemIdItslfe: itemId,
      });
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteSwap = async (swapId) => {
    try {
      await deleteOfferById(swapId);
      toast({
        title: t("successfully") || "Successfully",
        description: "Swap deleted successfully",
      });
      setShowDeleteDialog(false);
      getNotifications();
      router.refresh();
    } catch (err) {
      toast({
        title: t("error") || "Error",
        description: "Failed to delete swap",
        variant: "destructive",
      });
    }
  };

  // accepted swap
const getAcceptSwap = async (offerId) => {
  const acceptSwap = await  acceptedOfferById(offerId);
  if (!acceptSwap) {
    toast({
      title: t("error") || "Error",
      description: "Failed to accept swap",
      variant: "destructive",
    });

}else{
 toast({
                            title: t("successfully") || "Successfully",
                            description: "Swap accepted successfully",
                          });
                          router.refresh();
}
}


  //  completed swap
const getCompleteSwap = async (offerId) => {
  const completeSwap = await  completedOfferById(offerId);
  if (!completeSwap) {
    toast({
      title: t("error") || "Error",
      description: "Failed to complete swap",
      variant: "destructive",
    });

}else{
 toast({
                            title: t("successfully") || "Successfully",
                            description: "Swap completed successfully",
                          });
                          router.refresh();
}
}



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


  useEffect(() => {
    const fetchUserId = async () => {
      const { id } = await decodedToken();
      setMyUserId(id);
    };
    fetchUserId();
    getNotifications();
    handleGetMessages();
  }, [getNotifications, handleGetMessages]);

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
              <Button
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


 {/* Complete Swap Dialog */}
      <Dialog open={showComleteDialog}  onOpenChange={setShowComleteDialog}> 
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Swap</DialogTitle>
            <DialogDescription>
              <ul>
                <li>Are you sure you want to Complete this swap?      </li>
                <li>If you complete the swap, you will not be able to undo this action.</li>
                <li>Chat will be closed.</li>
                <li>Items will be removed.</li>
              </ul>

            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={async () => {
                  await getCompleteSwap(pendingCompleted.idOffer);
                  setShowComleteDialog(false);
                  router.refresh();
                }}
              >
                Complete
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => setShowComleteDialog(false)}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* --- Swap Summary Stats --- */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">{offers.length===0?"No":offers.length}</span>
                  <BellDot />
              <span className="text-xs text-muted-foreground">All Notifications</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "pending").length===0 ?"No" : offers.filter((o) => o.status_offer === "pending").length}
              </span>   <Loader />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "accepted").length===0 ?"No" : offers.filter((o) => o.status_offer === "accepted").length}
              </span> <Handshake />
              <span className="text-xs text-muted-foreground">Accepted</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "completed").length===0 ?"No" : offers.filter((o) => o.status_offer === "completed").length}
              </span>  <CheckCheck />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-lg font-bold">
                {offers.filter((o) => o.status_offer === "rejected").length===0 ?"No" : offers.filter((o) => o.status_offer === "rejected").length}
              </span><BadgeX />
              <span className="text-xs text-muted-foreground">Rejected</span>
            </div>
          </div>
          {/* --- End Swap Summary Stats --- */}

          {/* --- Notifications List --- */}
          {[...offers]
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((offer) => (
              <Card key={offer.id} id={offer.id}  className="overflow-hidden my-2 border-primary/50 bg-primary/5 hover:shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center ">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        My items:{" "}
                        {
                          itemsOffer.filter(
                            (u) =>
                              u.offered_by === offer.to_user_id &&
                              u.offer_id === offer.id
                          ).length
                        }{" "}
                        | Their items:{" "}
                        {
                          itemsOffer.filter(
                            (u) =>
                              u.offered_by !== offer.to_user_id &&
                              u.offer_id === offer.id
                          ).length
                        }
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {offer.date_created
                          ? new Date(offer.date_created).toLocaleString()
                          : ""}
                      </div>

                       <div 
   className={`text-xs mt-1
    flex items-center gap-1  
    ${offer.cash_adjustment ?  "text-green-500" : "text-red-500"}`}>

                        <Scale  className="w-3 h-3" />
                        {offer.cash_adjustment
                          ? `Cash Adjustment: ${handlePriceDifference(offer.to_user_id , offer.cash_adjustment)}`
                          : ""}
                      </div>

                    </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={  `http://localhost:8055/assets/${userSwaps.find((u) => u.id === offer.from_user_id) ?.avatar}` || "/placeholder.svg"
                          }
                          alt={
                            userSwaps.find((u) => u.id === offer.from_user_id)
                              ?.first_name || "User"
                          }
                        />
                        <AvatarFallback>
                          {userSwaps.find((u) => u.id === offer.from_user_id)
                            ?.first_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>

                      
                                          
                      
                      <div>
                        <div className="font-semibold text-base">
                          {userSwaps.find((u) => u.id === offer.from_user_id)
                            ?.first_name || "User"}
                        </div>
                      </div>
                    </div>

                       {/* User Info Section */}
                                          <div className="flex items-center space-x-4 mb-4 p-3 bg-muted/30 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                              <MapPin className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">
                                                {` ${
                                                  userSwaps.find(
                                                    (u) => u.id === offer.from_user_id
                                                  )?.country
                                                } , ${
                                                  userSwaps.find(
                                                    (u) => u.id === offer.from_user_id
                                                  )?.city
                                                } , ${
                                                  userSwaps.find(
                                                    (u) => u.id === offer.from_user_id
                                                  )?.street
                                                }`}
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                              <span className="text-sm font-medium">
                                                {
                                                  userSwaps.find(
                                                    (u) => u.id === offer.from_user_id
                                                  )?.ratings
                                                }
                                              </span>
                                            </div>
                                          </div>
                  </div>
                </CardHeader>
                <CardContent  >
                  {["pending", "accepted"].includes(offer.status_offer) ? (
                    <>
                    <div className="grid bg-muted/50 p-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3  sm:grid-cols-3 xs:grid-cols-1 gap-4 mb-4 items-center">
 {/* My Items */}
                      <div className=" text-center">
                        <h4 className="font-semibold mb-2">My Items</h4>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-4">
                          {swapItems
                            .filter(
                              (u) =>
                                u.offered_by === offer.to_user_id &&
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

                         {/* Swap Arrow */}
                                                <div className="flex flex-col items-center space-y-2">
                                                  <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                                                  <span className="text-xs text-muted-foreground">
                                                    Exchange
                                                  </span>
                                                </div>
                      
                      {/* Their Items */}
                      <div className="text-center">
                        <h4 className="font-semibold mb-2">Their Items</h4>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-4">
                          {swapItems
                            .filter(
                              (u) =>
                                u.offered_by !== offer.to_user_id &&
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
                    </div>
                     
                      {/* Chat Section */}
                      <Card className="mb-6 mt-2">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Chat with Swap Partner
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-40 w-full border rounded-md p-4 mb-4">
                            <div className="space-y-3">
                              {chatMessages
                                .filter((m) => m.offer_id === offer.id)
                                .map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${
                                      msg.from_user_id === myUserId
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`max-w-xs rounded-lg p-3 ${
                                        msg.from_user_id === myUserId
                                          ? "bg-primary text-primary-foreground ml-auto"
                                          : "bg-muted"
                                      }`}
                                    >
                                      <div className="text-sm">
                                        {msg.message}
                                      </div>
                                      <div className="text-xs opacity-70 mt-1">
                                        {new Date(
                                          msg.date_created
                                        ).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </ScrollArea>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Type your message..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleSendMessage(
                                  offer.from_user_id,
                                  offer.id
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              onClick={() =>
                                handleSendMessage(
                                  offer.from_user_id,
                                  offer.id
                                )
                              }
                              size="icon"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
                      <h3 className="text-xl font-semibold mb-2">
                        Swap Rejected
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        The swap was rejected.
                      </p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  {/* Footer: Delete Swap if pending */}

                  {offer.status_offer === "pending" && (
                    <>
                       <div className="flex justify-around space-x-2 mt-4 ">
                      
<Button
                        // variant="destructive"
                        size="sm"
                        onClick={() => {
                          getAcceptSwap(offer.id);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Handshake className="h-4 w-4" />
                        Accept Swap
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setPendingDelete({
                            idItem: null,
                            idOffer: offer.id,
                            owner: null,
                          });
                          setShowDeleteDialog(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Reject Swap
                      </Button>

                    </div>

                    </>
                 

                    
                  )}

                  {/* Footer:  Swap if pending */}

                  {offer.status_offer === "accepted" && (
                    <div className="flex justify-around space-x-2 mt-4 ">
                      
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
                        <ShieldCheck  className="h-4 w-4" />
                        Complete Swap
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setPendingDelete({
                            idItem: null,
                            idOffer: offer.id,
                            owner: null,
                          });
                          setShowDeleteDialog(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Reject Swap
                      </Button>

                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          {/* Empty state */}
          {offers.length === 0 && (
            <Card className="p-12 text-center mt-8">
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
               <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => router.push("/products")}>Make Swap</Button>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;

// CardItemSwap component (reuse from cart page)
const CardItemSwap = ({
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
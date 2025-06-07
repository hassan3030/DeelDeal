"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  getOfferById,
  getOfferItemsByOfferId,
  deleteOfferById,
  deleteOfferItemsById,
  getOffersNotifications,
  addMessage,
  getMessage,
  getAllMessage,
} from "@/callAPI/swap";
import { getUserById } from "@/callAPI/users";
import { getCookie, decodedToken } from "@/callAPI/utiles";
import { getProductById, getImageProducts } from "@/callAPI/products";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { MessageCircle, Send, Trash2 } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Bell,
  User,
  Clock,
  Check,
  ArrowRightLeft,
  MapPin,
  Star,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "@/lib/use-translations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const Notifications = () => {
  const { t } = useTranslations();

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleSendMessage = async (to_user_id, offer_id) => {
    if (message) {
      const newMessage = await addMessage(message.trim(), to_user_id, offer_id);
      if (newMessage) {
        setMessage("");
      }
    }
  };

  const handleGetMessages = async () => {
    const messages = await getAllMessage();
    setChatMessages(messages);
    console.log("chatMessages", messages);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const notificationsPerPage = 3;

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleAccept = (notificationId) => {
    toast.success("Swap proposal accepted!");
    markAsRead(notificationId);
  };

  const handleDecline = (notificationId) => {
    toast.info("Swap proposal declined");
    markAsRead(notificationId);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const formatMeetingDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination calculations
  const [notificationsLength, setNotificationsLength] = useState(0);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // -----------------------------------

  //   const [notificationsLength, setNotificationsLength] = useState(0)
  //     const [swapItems, setSwapItems] = useState([1,2,3])
  //     const [myItems, setMyItems] = useState([1,2,3])
  //     const [userSwaps, setUserSwaps] = useState([])
  //     const router = useRouter();

  //   const getNotifications = async () => {
  //       const token = await getCookie()
  //       if (token) {
  //          let offerItems = []
  //          let items = []
  //          let usersSwaper = []
  //         const {id} = await decodedToken(token)
  //         // get notifications
  //         const notifications = await getOfferById(id);

  //         // get notifications items based offors id
  //         for(const offer of notifications){
  //           const offerItem = await getOfferItemsByOfferId(offer.id)
  //            offerItems.push(...offerItem)
  //           }

  //           // get items itself based offors items id
  //         for(const item of offerItems){
  //           const product = await getProductById(item.item_id);
  //           items.push({ ...product });
  //         }

  //         // get user swaps based on user id and notifications id
  //    for(const item of items){
  //           const user = await getUserByProductId(item.id);
  //           usersSwaper.push({ ...user });
  //         }

  //         const uniqueUsers = usersSwaper.filter(
  //     (obj, index, self) =>
  //       index === self.findIndex((t) => t.id === obj.id)
  //   );
  //   setNotifications(notifications)
  //   setUserSwaps(uniqueUsers)
  //   setSwapItems(items)

  //   console.log("setNotifications", notifications); // Check what is returned
  //   console.log("offerItems", offerItems); // Check what is returned
  //   console.log("items", items); // Check what is returned
  //   console.log("usersSwaper", usersSwaper); // Check what is returned

  //   setNotificationsLength(Array.isArray(notifications) ? notifications.length : 0); // Update cart length

  //       }
  //     }

  //     const deleteNotification = (notificationId) => {
  //     setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  //     toast.success("Notification deleted");
  //   };

  //     const handleDeleteSwap = async(swapId) => {
  //    await  deleteOfferById(swapId)
  //     toast.success("Swap deleted successfully");
  //     };

  //   const handleDelete = async(itemId) => {
  //        await  deleteOfferItemsById(itemId)
  //       toast.success("Product deleted successfully");
  //     };

  //     const handleView = (itemId) => {
  //      router.push(`/products/${itemId}`)
  //     };
  //     const sendMessage = (notificationId) => {
  //     //  send message logic here
  //     toast.success("Message sent successfully");

  //     };

  //   useEffect(() => {
  //   getNotifications();
  // }, []);

  const [swapItems, setSwapItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [itemsOffer, setItemsOffer] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cashAdjustment, setCashAdjustment] = useState(null);
  const [totalCash, setTotalCash] = useState("");
  const [pendingDelete, setPendingDelete] = useState({
    idItem: null,
    idOffer: null,
    owner: null,
    itemIdItslfe: null,
  });

  const router = useRouter();

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

  const getNotifications = useCallback(async () => {
    const token = await getCookie();
    if (!token) return;

    let offerItems = [];
    let items = [];
    let usersSwaper = [];
    const { id } = await decodedToken();

    const notifications = await getOffersNotifications(id);

    for (const notification of notifications) {
      const offerItem = await getOfferItemsByOfferId(notification.id);
      const user_from = await getUserById(notification.from_user_id);
      const user_to = await getUserById(notification.to_user_id);
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

    setNotificationsLength(notifications.length);
    setNotifications(notifications);
    setUserSwaps(uniqueUsers);
    setSwapItems(items);
    console.log("swapItems", items);
    setItemsOffer(offerItems);
  }, []);

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

  const updateCashAdjustmentAfterRemove = (offerId) => {
    // Find all items for this offer
    const offerItems = swapItems.filter((item) => item.offer_id === offerId);

    // Calculate total price for my items and their items
    const offer = notifications.find((o) => o.id === offerId);
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
      if (cash > 0) return `You pay: ${Math.abs(Math.ceil(cash))} LE`;
      if (cash < 0) return `You get: ${Math.abs(Math.ceil(cash))} LE`;
      return `The price is equal`;
    } else {
      if (cash < 0) return `You pay: ${Math.abs(Math.ceil(cash))} LE`;
      if (cash > 0) return `You get: ${Math.abs(Math.ceil(cash))} LE`;
      return `The price is equal`;
    }
  };

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
  //         getNotifications();
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
      const offerItems = swapItems.filter(
        (item) => item.offer_id === idOffer && item.id !== itemIdItself
      );
      const offer = notifications.find((o) => o.id === idOffer);
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
      const newCashAdjustment = myTotal - theirTotal;

      // Now call the API with the new value
      if (myItems.length > 1) {
        await deleteOfferItemsById(
          idItem,
          itemIdItself,
          newCashAdjustment,
          idOffer
        );
        toast({
          title: t("successfully") || "Successfully",
          description: "Item deleted successfully",
        });
      } else {
        setPendingDelete({
          idItem,
          idOffer,
          owner,
          itemIdItslfe: itemIdItself,
        });
        setShowDeleteDialog(true);
      }

      // Refresh notifications/items from backend
      getNotifications();
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
  const [myUserId, setMyUserId] = useState();

  useEffect(() => {
    const { id } = decodedToken();
    setMyUserId(id);
    handleGetMessages();
    getNotifications();
    updateCashAdjustmentAfterRemove();
    console.log("swapItems", swapItems);
  }, [getNotifications, chatMessages]);
  return (
    <>
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

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-8 px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-background flex items-center">
                <Bell className="mr-3 h-8 w-8" />
                Notifications
                {notificationsLength > 0 && (
                  <Badge className="ml-3 bg-red-500 text-white">
                    {notificationsLength}
                  </Badge>
                )}
              </h1>
              <p className="text-background/90 mt-2">
                Stay updated with your swap activities
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Notifications List */}
          <div className="space-y-6">
            {notifications.map((notification, index) => (
              // offer itself
              
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-lg ${
                  // will handle
                  !notification?.isRead ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {/* <img
                        src={`http://localhost:8055/assets/${userSwaps.find(u => u.id === notification.from_user_id).avatar}` || "/placeholder.svg"}
                        alt={userSwaps.find(u => u.id === notification.from_user_id).first_name || t("account")}
                       className="w-full h-full object-cover"
                      
                      /> */}

                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={
                            `http://localhost:8055/assets/${
                              userSwaps.find(
                                (u) => u.id === notification.from_user_id
                              )?.avatar
                            }` || "/placeholder.svg"
                          }
                          alt={
                            userSwaps.find(
                              (u) => u.id === notification.from_user_id
                            )?.first_name || t("account")
                          }
                        />
                        <AvatarFallback>
                          {userSwaps
                            .find((u) => u.id === notification.from_user_id)
                            ?.first_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <User className="h-6 w-6 text-gray-500" />

                        <span className="text-muted-foreground">
                          {" "}
                          {userSwaps.find(
                            (u) => u.id === notification.from_user_id
                          )?.first_name || "Unknown"}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {/* {getNotificationIcon(notification.type)} */}
                          <h3 className="font-semibold text-sm">
                            {userSwaps.find(
                              (u) => u.id === notification.from_user_id
                            )?.first_name || "Unknown"}
                          </h3>
                          {!notification?.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {getTimeAgo(
                              new Date(notification?.date_created)
                                .toISOString()
                                .split("T")[0]
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                        {notification?.message}
                      </p>

                      {/* User Info Section */}
                      <div className="flex items-center space-x-4 mb-4 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {` ${
                              userSwaps.find(
                                (u) => u.id === notification.from_user_id
                              )?.country
                            } , ${
                              userSwaps.find(
                                (u) => u.id === notification.from_user_id
                              )?.city
                            } , ${
                              userSwaps.find(
                                (u) => u.id === notification.from_user_id
                              )?.street
                            }`}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {
                              userSwaps.find(
                                (u) => u.id === notification.from_user_id
                              )?.ratings
                            }
                          </span>
                        </div>
                      </div>

                      {/* Swap Details Card */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        {/* <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-sm">{notification?.swapDetails?.swapName}</h4>
                        <Badge variant="outline" className="text-xs">
                          Swap ID: #{notification?.id}00{notification?.id}
                        </Badge>
                      </div> */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          {/* Their Product */}
                          <div className="text-center space-y-3">
                            <p className="text-xs text-muted-foreground font-medium">
                              Their Product
                            </p>
                            {swapItems
                              .filter(
                                (u) => u.user_id === notification.to_user_id
                              )
                              ?.map((item) => (
                                <NotificationsCard
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

                          {/* Swap Arrow */}
                          <div className="flex flex-col items-center space-y-2">
                            <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Exchange
                            </span>
                          </div>

                          {/* Your Product */}
                          <div className="text-center space-y-3">
                            <p className="text-xs text-muted-foreground font-medium">
                              Your Product
                            </p>
                            {swapItems
                              .filter(
                                (u) => u.user_id === notification.from_user_id
                              )
                              ?.map((item) => (
                                <NotificationsCard
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

                        {/* Additional Details */}
                        {notification?.swapDetails?.additionalTerms && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <strong>Additional Terms:</strong>{" "}
                              {notification?.swapDetails?.additionalTerms}
                            </p>
                          </div>
                        )}

                        {notification?.swapDetails?.meetingDate && (
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-700 dark:text-green-300">
                              <strong>Meeting Scheduled:</strong>{" "}
                              {formatMeetingDate(
                                notification?.swapDetails?.meetingDate
                              )}
                            </p>
                          </div>
                        )}

                        {notification?.swapDetails?.completedDate && (
                          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg flex items-center space-x-2">
                            <Check className="h-4 w-4 text-purple-600" />
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              <strong>Completed:</strong>{" "}
                              {formatMeetingDate(
                                notification?.swapDetails.completedDate
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(notification?.id)}
                              className="h-8 px-3"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecline(notification?.id)}
                              className="h-8 px-3"
                            >
                              Decline
                            </Button>
                          </>
                        </div>
                        {/* add message  */}

                        {/* Chat Section */}
                      </div>
                      <Card className="mb-6 mt-2">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Chat with Swap Partners
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                        

          <ScrollArea 
                          className="h-40 w-full border rounded-md p-4 mb-4">
                            <div className="space-y-3">
                              {chatMessages
                                .filter((m) => m.offer_id === notification.id)
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
                                      {/* <div className="text-sm font-medium mb-1">{ msg.to_user_id === notification.to_user_id ? "You":"Partener"}</div> */}
                                      <div className="text-sm">
                                        {msg.message}
                                      </div>
                                      <div className="text-xs opacity-70 mt-1">
                                        {" "}
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
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSendMessage(
                                     notification.from_user_id,
                                  notification.id,
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              onClick={() => {
                                handleSendMessage(
                                  notification.from_user_id,
                                  notification.id,
                                );
                              }}
                              size="icon"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* <div className="flex items-center space-x-2">
                        
                      
                          <>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => sendMessage(notification?.id)}
                              className="h-8 my-3"
                            >
                              Send Message
                            </Button>
                          </>
                    
                   
                      </div> */}
                      {/* <div className="space-y-2">
                        <Textarea id="message" name="message" value={message} onChange={(e)=>setMessage(e.target.value)} rows={2}  placeholder='Add Message To Swaper'/>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {notifications.length === 0 && (
            <Card className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;

const NotificationsCard = ({
  id,
  name,
  description,
  price,
  category,
  status_item,
  value_estimate,
  date_created,
  country,
  city,
  street,
  images,
  deleteItem,
}) => {
  const { toast } = useToast();
  const [bigImage, setBigImage] = useState("");

  const getDataImage = async () => {
    const images2 = await getImageProducts(images);
    // setImages(images)
    setBigImage(images2[0].directus_files_id);
  };
  const handleDelete = async () => {
    await deleteProduct(id);
    toast({
      title: "Item Deleted",
      description: "The item has been successfully deleted.",
      variant: "success", // Assuming your toast supports variants like 'success', 'error', etc.
    });
    // Add yo
  };
  const dialogDelet = (
    <Dialog>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Trash2 className="mr-1 h-4 w-4" />
      </DialogTrigger>
      {/* Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete One Items</DialogTitle>
          <DialogDescription>
            {/* This is a description of the dialog content. */}
          </DialogDescription>
        </DialogHeader>
        <p>Are you sure submit delete this items</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" onClick={deleteItem}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  useEffect(() => {
    getDataImage();
  }, [images, id]);
  return (
    <>
      <div className="bg-background rounded-lg p-3 space-y-2">
        <img
          src={`http://localhost:8055/assets/${bigImage}` || "/placeholder.svg"}
          alt={name}
          className="w-full h-24 object-cover rounded-md"
        />
        <p className="text-sm font-medium">{name}</p>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Condition: {status_item}</span>
          <span className="font-medium text-green-600">{price}</span>
        </div>
        {/* actions */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <Link href={`/products/${id}`} className="hover:scale-110 ">
            <span className="font-medium text-green-600 hover:cursor-pointer">
              <Eye className="mr-1 h-4 w-4" />
            </span>
          </Link>
          <span className="font-medium text-red-600 hover:scale-110 hover:cursor-pointer">
            {" "}
            {dialogDelet}{" "}
          </span>
        </div>
      </div>
    </>
  );
};

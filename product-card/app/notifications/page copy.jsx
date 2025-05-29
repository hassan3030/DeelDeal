"use client"
import  { useState , useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { getOfferById, getOfferItemsById, getOfferItemsByOfferId, getProductById , deleteOfferById, deleteOfferItemsById, getImageProducts } from "@/callAPI/products";
import { getUserById, getUserByProductId } from "@/callAPI/users";
import { getCookie , decodedToken } from "@/callAPI/utiles";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { 
  Bell, 
  User, 
  MessageCircle, 
  Heart, 
  Package, 
  Clock,
  Check,
  X,
  Archive,
  Eye,
  Trash2,
  Hash,
  Calendar,
  UserRoundCheck,
  ShoppingBasket
} from "lucide-react";
import { toast } from "sonner";
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

const Notifications = () => {

    const [notifications, setNotifications] = useState([]);


  

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success("Notification deleted");
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
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [cartLength, setCartLength] = useState(0)
    const [swapItems, setSwapItems] = useState([1,2,3])
    const [myItems, setMyItems] = useState([1,2,3])
    const [userSwaps, setUserSwaps] = useState([])
    const router = useRouter();
  
  const getOffers = async () => {
      const token = await getCookie()
      if (token) {
         let offerItems = []
         let items = []
         let usersSwaper = []
        const {id} = await decodedToken(token)
        // get offers 
        const offers = await getOfferById(id);
  
        // get offers items based offors id 
        for(const offer of offers){
          const offerItem = await getOfferItemsByOfferId(offer.id)
           offerItems.push(...offerItem)
          }
  
          // get items itself based offors items id 
        for(const item of offerItems){
          const product = await getProductById(item.item_id);
          items.push({ ...product });
        }   
        
        // get user swaps based on user id and offers id
   for(const item of items){
          const user = await getUserByProductId(item.id);
          usersSwaper.push({ ...user });
        }   
     
        const uniqueUsers = usersSwaper.filter(
    (obj, index, self) =>
      index === self.findIndex((t) => t.id === obj.id)
  );
  setNotifications(offers)
  setUserSwaps(uniqueUsers)
  setSwapItems(items)
  
  console.log("setNotifications", offers); // Check what is returned
  console.log("offerItems", offerItems); // Check what is returned
  console.log("items", items); // Check what is returned
  console.log("usersSwaper", usersSwaper); // Check what is returned
  
  setCartLength(Array.isArray(offers) ? offers.length : 0); // Update cart length
      
      }
    }
   
  
    const handleDeleteSwap = async(swapId) => {
   await  deleteOfferById(swapId)
    toast.success("Swap deleted successfully");
    };
  
  const handleDelete = async(itemId) => {
       await  deleteOfferItemsById(itemId)
      toast.success("Product deleted successfully");
    };
  
    const handleView = (itemId) => {
     router.push(`/products/${itemId}`)
    };
  
  
  useEffect(() => {
  getOffers();
}, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-background flex items-center">
              <Bell className="mr-3 h-8 w-8" />
              Notifications
              {cartLength > 0 && (
                <Badge className="ml-3 bg-red-500 text-white">
                  {cartLength}
                </Badge>
              )}
            </h1>
            <p className="text-background/90 mt-2">Stay updated with your swap activities</p>
          </div>
        
        </div>
      </div>
      <div className="w-full mx-auto px-4 py-8">

     
        {/* Notifications List */}
        <div className="space-y-4 p-2">
          {notifications.map((notification , index) => (
            <Card 
              key={notification.id} 
              className={`transition-all hover:shadow-md ${
                notification.status_offer === 'rejected' ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              {/* -------------------- */}
 <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-1  md:grid-cols-3 gap-4 m-4 ">
             <div className="flex items-center text-sm">
                        <Hash  className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        <span className="text-muted-foreground">Swap: {index+1}</span>
                      </div>
             <div className="flex items-center text-sm">
                       <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSwap(notification.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reject Swap
                      </Button>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Created: {new Date(notification?.date_created).toISOString().split("T")[0]} </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UserRoundCheck  className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Swap with: {userSwaps.find(u => u.id === notification.from_user_id)?.first_name || "Unknown"}</span>
                      </div>
   <div className="flex items-center text-sm ">
                        <ShoppingBasket  className="h-4 w-4 mr-2 text-muted-foreground" />

                        <span className="text-muted-foreground px-1 min-w-28 ">My Items: </span>
                        {swapItems.filter(u => u.user_id === notification.to_user_id)?.map((item)=>(
                          <span key={item.id} className="text-muted-foreground rounded-sm border border-gray-500 p-1 mr-1 min-w-28 "> 
                          {item.name.slice(0, 6)+"..."} 
                          <Trash2 className="h-4 w-4 mr-2 text-red-600 inline hover:scale-110 mx-1" onClick={()=>{handleDelete(item.id)}} /> 
                          <Eye className="h-4 w-4 mr-2 text-green-500 inline hover:scale-110 mx-1" onClick={()=>{handleView(item.id)}} /> 
                          </span>
                        ))}


                      </div>
  
                      
                    </div>



              {/* -------------------- */}
             {swapItems.filter(u => u.user_id === notification.to_user_id)?.map((item)=>(
            <NotificationsCard key={item.id} {...item}/>
                        ))}
            </Card>
          ))}
        </div>

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
    images
})=>{

   const { toast } = useToast();
    const [bigImage , setBigImage] =  useState('')

       const getDataImage = async () => {
        const images2 = await getImageProducts(images)
        // setImages(images)
        setBigImage(images2[0].directus_files_id)
     
      }
    const handleDelete = async () => {
    await deleteProduct(id);
   toast({
    title: "Item Deleted",
    description: "The item has been successfully deleted.",
    variant: "success", // Assuming your toast supports variants like 'success', 'error', etc.
  })
  // Add yo
  }
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
              <Button variant="secondary" onClick={()=>{handleDelete()}}>Delete</Button>
            </DialogClose>
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
)
  useEffect(() => {
    getDataImage()
  }
  , [images , id])
  return(
    <>
<div className="flex flex-col rounded-lg border sm:flex-row m-2">

                        <div className="relative h-20 w-20  ">
                          <Image
                            src={`http://localhost:8055/assets/${bigImage}`|| "/placeholder.svg"}
                            alt={name}
                            fill
                            className="rounded-t-lg object-cover sm:rounded-l-lg sm:rounded-tr-none"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{name}</h3>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge>{category}</Badge>
                                <Badge variant={status_item === "Available" ? "outline" : "secondary"}>
                                  {status_item}
                                </Badge>
                                <Badge className='bg-green-400'>
                                  <Link href={`/products/${id}`}>
                                  <Eye className="mr-1 h-4 w-4" />
                                
                              </Link>
                                </Badge>
                      <Badge className='bg-red-600'>
                                  
                                
                                {dialogDelet}
              
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  maximumFractionDigits: 0,
                                }).format(value_estimate)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Listed on {new Date(date_created).toISOString().split("T")[0]}
                              </p>
                              
                            </div>
                          </div>
              
                         
                        </div>
                      </div>
    </>
  )
}

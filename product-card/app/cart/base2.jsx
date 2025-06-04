"use client"

import { useEffect, useState } from 'react'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProductById , getImageProducts } from "@/callAPI/products";
import { getOfferById, getOfferItemsById, getOfferItemsByOfferId , deleteOfferById, deleteOfferItemsById } from "@/callAPI/swap";
import { getUserById, getUserByProductId } from "@/callAPI/users";
import { getCookie , decodedToken } from "@/callAPI/utiles";
import { useTranslations } from "@/lib/use-translations"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ShoppingCart, 
  Package, 
  Calendar, 
  User, 
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Cart = () => {
 
  
  // Mock data for user's swaps with multiple items for each swap
  
  
  // const handleViewItem = (swapId, itemId) => {
  //   toast.info(`Viewing item ${itemId} from swap ${swapId}`);
  // };

  // const handleDeleteItem = (swapId, itemId) => {
  //   setUserSwaps(prev => prev.map(swap => 
  //     swap.id === swapId 
  //       ? { ...swap, items: swap.items.filter(item => item.id !== itemId) }
  //       : swap
  //   ).filter(swap => swap.items.length > 0));
  //   toast.success("Item deleted successfully");
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // const totalItems = userSwaps.reduce((total, swap) => total + swap.items.length, 0);


  // ----------------------------------------------------//
  
    const [swapItems, setSwapItems] = useState([])
    const [userSwaps, setUserSwaps] = useState([])
    const [offers, setOffers] = useState([])
    const router = useRouter();
    const { t } = useTranslations()

  const getOffers = async () => {
      const token = await getCookie()
      if (token) {
         let offerItems = []
         let items = []
         let usersSwaper = []
        const {id} = await decodedToken()

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

  setOffers(offers)
  setUserSwaps(uniqueUsers)
  setSwapItems(items)
  
  console.log("offers", offers); // Check what is returned
  console.log("offerItems", offerItems); // Check what is returned
  console.log("items", items); // Check what is returned
  console.log("usersSwaper", usersSwaper); // Check what is returned
  
      
      }
    }
   
  
   
    const handleDeleteSwap = async(swapId) => {
   await  deleteOfferById(swapId)
    toast.success("Swap deleted successfully");//------------
    };
  
  
  
  
    useEffect(() => {
       getOffers()
    }, []);


  return (
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
                  {offers?.length||t('notFoundSwaps')}
                </Badge>
              )}
            </h1>
            <p className="text-background/90 mt-2">Manage all your swap listings</p>
          </div>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{offers.length?offers.length: t('notFoundSwaps')}</div>
              <div className="text-sm text-muted-foreground">Total Swaps</div>
            </CardContent>
          </Card>
          
        </div>

        {/* Swaps List */}
        <div className="space-y-6">
       {offers.map((offer , index) => (
            <Card key={offer.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Swap: {index + 1}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-3">
                    
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(offer.status_offer)}`}
                      >
                        {offer.status_offer}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      My items: {swapItems.filter(u => u.user_id === offer.from_user_id).length} {"    "}
                      Thier items: {swapItems.filter(u => u.user_id === offer.to_user_id).length} {"    "}
                    </div>
                  </div>
                </div>

              </CardHeader>
              
              <CardContent>
                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {
                          
                         swapItems.filter(u => u.user_id === offer.from_user_id)?.map((item)=>(
                           <CardItemSwap key={item.id} {...item}/>
                          ))
                         }


                   
               
                </div>

                <Separator className="my-4" />

                {/* Swap Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-1">{new Date(offer.date_created).toISOString().split("T")[0]}</span>
                  </div>
                 
                 
                

                  <div className="flex items-center text-sm">

                     <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                  {/* <img
                                        src={`http://localhost:8055/assets/${userSwaps.find(u => u.id === offer.from_user_id)?.avatar}` || "/placeholder.svg"}
                                        alt={userSwaps.find(u => u.id === offer.from_user_id)?.first_name || t("account")}
                                       className="w-full h-full object-cover"
                                      
                                      /> */}
                                          <Avatar className="h-12 w-12">
                                            <AvatarImage src={`http://localhost:8055/assets/${userSwaps.find(u => u.id === offer.to_user_id)?.avatar}` || "/placeholder.svg"}
                                            alt={userSwaps.find(u => u.id === offer.from_user_id)?.first_name || t("account")}/>
                                            <AvatarFallback>{userSwaps.find(u => u.id === offer.from_user_id)?.first_name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          


                                    <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                                      <User className="h-6 w-6 text-gray-500" />
                          
                                        <span className="text-base"> {userSwaps.find(u => u.id === offer.to_user_id)?.first_name || "Unknown"}</span>
                                    </div>
                                  </div>
                
                  </div>
                  <div className="flex items-center text-sm ">
                   
                    <span className="text-muted-foreground text-red-600  hover:scale-110 cursor-pointer"
                    onClick={() => handleDeleteSwap(offer.id)}
                    >
                       <Trash2 className="inline h-4 w-4 mr-2 text-muted-foreground text-red-600 hover:scale-110 cursor-pointer" />
                      Delete Swap</span>
                 
                  </div>
                 
                 
                
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {userSwaps.length === 0 && (
          <Card className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No swaps yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first swap listing
            </p>
            <Button>Create New Swap</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cart;



export const CardItemSwap = ({
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
}) => {
  const router = useRouter();
const handleDelete = async(id) => {
     await  deleteOfferItemsById(id)
    toast.success("Product deleted successfully");
  };

  const handleView = (id) => {
   router.push(`/products/${id}`)
  };

  const [bigImage , setBigImage] =  useState('')
 const getDataImage = async () => {
  const images2 = await getImageProducts(images)
  // setImages(images)
  setBigImage(images2[0].directus_files_id)
  // console.log('i am in single product ' , images)
}

useEffect(() => {
    getDataImage()
  }
  )
  return (
    <>
  
    
    
 <Card key={id} className="overflow-hidden">
                      <div className="h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <img 
                         src={`http://localhost:8055/assets/${bigImage}` || "/placeholder.svg"}
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
                          <Badge variant="outline" className="text-xs">{status_item}</Badge>
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
                            onClick={() => handleDelete(id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
    </>


  )
}




  // <div>
  //       <Card  className="overflow-hidden">
  //             <CardContent className="p-0">
  //               <div className="flex flex-col lg:flex-row">
  //                 {/* Image */}
 

  //                 <div className="lg:w-64 h-48 lg:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
  //                       <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-md">
  //                         <Image src={`http://localhost:8055/assets/${bigImage}` || "/placeholder.svg"} alt={name} fill className=" max-h-44" />
  //                       </div>
              
  //                 </div>
                  
  //                 {/* Content */}
  //                 <div className="flex-1 p-6">
  //                   <div className="flex justify-between items-start mb-4">
  //                     <div>
  //                       <h3 className="text-xl font-semibold mb-2">{name}</h3>
  //                       <p className="text-muted-foreground mb-3 line-clamp-1">{description}</p>
  //                       <div className="flex flex-wrap gap-2">
  //                         <Badge variant="secondary">{category}</Badge>
  //                         <Badge variant="outline">{status_item}</Badge>
  //                         <Badge variant="outline" className='text-green-500'>Price: {price}</Badge>
  //                       </div>
  //                     </div>
  //                     <div className="text-right">
  //                       <div className="text-2xl font-bold text-primary">{value_estimate}</div>
  //                       <div className="text-sm text-muted-foreground">Estimated Value</div>
  //                     </div>
                      
  //                   </div>

  //                   <Separator className="my-4" />

  //                   {/* Details Grid */}
  //                   <div className="grid grid-cols-2  gap-4 mb-4">
  //                     <div className="flex items-center text-sm">
  //                       <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
  //                       <span className="text-muted-foreground">Created:</span>
  //                       <span className="ml-1"> {new Date(date_created).toISOString().split("T")[0]}</span>
  //                     </div>
  //                     <div className="flex items-center text-sm">
  //                       <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
  //                       <span className="ml-1">{`Country: ${country} City: ${city} Street: ${street}`}</span>
  //                     </div>
                      
                     
  //                   </div>

  //                   {/* Actions */}
  //                   <div className="flex flex-wrap gap-2">
  //                     <Button
  //                       variant="outline"
  //                       size="sm"
  //                       onClick={() => handleView(id)}
  //                     >
  //                       <Eye className="h-4 w-4 mr-2" />
  //                       View Details
  //                     </Button>
                   
  //                     <Button
  //                       variant="destructive"
  //                       size="sm"
  //                       onClick={() => handleDelete(id)}
  //                     >
  //                       <Trash2 className="h-4 w-4 mr-2" />
  //                       Delete
  //                     </Button>
  //                   </div>
  //                 </div>
  //               </div>
  //             </CardContent>
  //           </Card>
  //   </div>
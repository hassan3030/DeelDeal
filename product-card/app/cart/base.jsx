
"use client"
import Image from 'next/image';
import { useState , useEffect} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOfferById, getOfferItemsById, getOfferItemsByOfferId, getProductById , deleteOfferById, deleteOfferItemsById, getImageProducts } from "@/callAPI/products";
import { getUserById, getUserByProductId } from "@/callAPI/users";
import { getCookie , decodedToken } from "@/callAPI/utiles";
import { useRouter } from "next/navigation";

import { 
  ShoppingCart, 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  Edit,
  Trash2,
  Eye,
  Hash ,
  UserRoundCheck ,
  ShoppingBasket 
  
} from "lucide-react";
import { toast } from "sonner";

const CartPage = () => {

  const [cartLength, setCartLength] = useState(0)
  const [swapItems, setSwapItems] = useState([1,2,3])
  const [myItems, setMyItems] = useState([1,2,3])
  const [userSwaps, setUserSwaps] = useState([])
  const [offers, setOffers] = useState([])
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
setOffers(offers)
setUserSwaps(uniqueUsers)
setSwapItems(items)

console.log("offers", offers); // Check what is returned
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
            </h1>
            <p className="text-background/90 mt-2">Manage all your swap listings</p>
          </div>
        <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{cartLength}</div>
              <div className="text-sm text-muted-foreground">Total Swaps</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
      

        {/* Swaps List */}
         {offers.map((offer , index) => (
        <div key={offer.id} className="space-y-6 p-3 rounded-sm border border-gray-500 mt-3" >
           <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-1  md:grid-cols-3 gap-4 mb-4">
             <div className="flex items-center text-sm">
                        <Hash  className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        <span className="text-muted-foreground">Swap: {index+1}</span>
                      </div>
             <div className="flex items-center text-sm">
                       <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSwap(offer.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Swap
                      </Button>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Created: {new Date(offer?.date_created).toISOString().split("T")[0]} </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UserRoundCheck  className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Swap with: {userSwaps.find(u => u.id === offer.to_user_id)?.first_name || "Unknown"}</span>
                      </div>
   <div className="flex items-center text-sm">
                        <ShoppingBasket  className="h-4 w-4 mr-2 text-muted-foreground" />

                        <span className="text-muted-foreground px-1">Your Items: </span>
                        {swapItems.filter(u => u.user_id === offer.from_user_id)?.map((item)=>(
                          <span key={item.id} className="text-muted-foreground rounded-sm border border-gray-500 p-1 mr-1  "> 
                          {item.name.slice(0, 6)+"..."} 
                          <Trash2 className="h-4 w-4 mr-2 text-red-600 inline hover:scale-110 mx-1" onClick={()=>{handleDelete(item.id)}} /> 
                          <Eye className="h-4 w-4 mr-2 text-green-500 inline hover:scale-110 mx-1" onClick={()=>{handleView(item.id)}} /> 
                          </span>
                        ))}


                      </div>
  
                      
                    </div>
           {
            
           swapItems.filter(u => u.user_id === offer.to_user_id)?.map((item)=>(
             <CardItemSwap key={item.id} {...item}/>
            ))
           }
        </div>
))}
        {userSwaps.length === 0 && (
          <Card className=" swapItems.map((item) => (p-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No swaps yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first swap listing
            </p>
            <Button onClick={()=>{router.push('/products')}}>Create New Swap</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartPage;



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
    <div>
        <Card  className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
 

                  <div className="lg:w-64 h-48 lg:h-auto bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <div className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-md">
                          <Image src={`http://localhost:8055/assets/${bigImage}` || "/placeholder.svg"} alt={name} fill className=" max-h-44" />
                        </div>
              
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{name}</h3>
                        <p className="text-muted-foreground mb-3 line-clamp-1">{description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{category}</Badge>
                          <Badge variant="outline">{status_item}</Badge>
                          <Badge variant="outline" className='text-green-500'>Price: {price}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{value_estimate}</div>
                        <div className="text-sm text-muted-foreground">Estimated Value</div>
                      </div>
                      
                    </div>

                    <Separator className="my-4" />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2  gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Created:</span>
                        <span className="ml-1"> {new Date(date_created).toISOString().split("T")[0]}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="ml-1">{`Country: ${country} City: ${city} Street: ${street}`}</span>
                      </div>
                      
                     
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                   
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
    </div>
  )
}

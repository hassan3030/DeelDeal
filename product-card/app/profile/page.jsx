"use client"

// import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { ItemsList } from "@/components/items-list"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Calendar, Verified, ArrowLeftRight, Package, Clock, Settings } from "lucide-react"
import {  } from '@/callAPI/products'
import { useParams } from 'next/navigation';
import { useTranslations } from "@/lib/use-translations"
import { getUserById, getUserByProductId } from "@/callAPI/users";

import { DeelProductCard } from "@/components/deel-product-card"
import { SmallCard } from "@/components/small-card"
import { getOfferById, getProductByUserId , getOfferItemsById, getOfferItemsByOfferId, getProductById , deleteOfferById, deleteOfferItemsById, getImageProducts } from "@/callAPI/products";

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { decodedToken, getCookie } from "@/callAPI/utiles"
import { offers } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage(){
  // from data.js
const [activeTab, setActiveTab] = useState("items")
const [items, setItems] = useState([])
 
 


const [user, setUser] = useState({
    id: "user1",
    email: "demo@example.com",
    password: "Password123",
    name: "Hassan Hamdi",
    location: "San Francisco, CA",
    avatar: "/avatar.png",
    rating: 4.8,
    verified: true,
    createdAt: "2022-01-15T00:00:00Z",
  })

 

  // Format date to a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // const handleEditProfile = async () => {
  // // -------------------------------------
  const { t } = useTranslations()
  const params = useParams();
  const id = params.id;
  const [user2, setUser2] = useState([])
  const [ avatar, setAvatar] = useState(null);
  const [products, setProducts] = useState([])
  const [ avatarPath, setAvatarPath] = useState('');
    const [first_name, setFirstName] = useState(user.first_name || '');
    const [last_name, setLasttName] = useState(user.last_name || '');
    const [full_name, setFullName] = useState(`${user2?.first_name} ${user2?.last_name}`|| '');
    const [gender, setGender] = useState('');
    const [ phone_number, setPhone] = useState(user.phone_number || '');
    const [ description, setDescription] = useState(user.description || '');
    const [ location, setLocation] = useState(user.location || '');


    const [ userItems , setUserItems] = useState([]);
    const [ userOffers , setUserOffers] = useState([]);
    const [swapItems, setSwapItems] = useState([])
    const [userSwaps, setUserSwaps] = useState([])

    const [myAvailableItems, setmyAvailableItems] = useState([])
    const [myUnavailableItems, setmyUnavailableItems] = useState([])

    

 

const getUser = async ()=>{
  const token = await getCookie()
     if (token) {
       const {id} = await decodedToken(token)
       if (!id) {
    return (
      <div className="container py-10">
        <p>Please sign in to view your profile.</p>
      </div>
    )
  }
       const userData = await getUserById(id)
       setUser2(userData)
     }
 
}  
const getUserProducts = async ()=>{
       const userPruducts = await getProductByUserId();
       setmyUnavailableItems(userPruducts.filter(u =>  u.status_swap === "unavailable"))
       setmyAvailableItems(userPruducts.filter(u =>  u.status_swap === "available"))
       return userPruducts
     }

     //get offers

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
  setUserOffers(offers)
  setUserSwaps(uniqueUsers)
  setSwapItems(items)
 
  console.log("setNotifications", offers); // Check what is returned
  console.log("offerItems", offerItems); // Check what is returned
  console.log("items", items); // Check what is returned
  console.log("usersSwaper", usersSwaper); // Check what is returned
  
  // setNotificationsLength(Array.isArray(offers) ? offers.length : 0); // Update cart length
      
      }
    }
   
     // get not available products


// Fetch user and products only once
useEffect(() => {

  getUser()
  getOffers()
  getUserProducts().then((data) => {
    setProducts(data)
  }
)

  
}, []);

// Update avatar path and full name when user2 changes
useEffect(() => {
  if (user2) {
    setAvatarPath(`http://localhost:8055/assets/${user2.avatar}`);
    setFullName(`${user2.first_name} ${user2.last_name}`);
  }
}, [user2]);
  //   let userCollectionData = {};
  //   if (first_name) userCollectionData.first_name = first_name;
  //   if (last_name) userCollectionData.last_name = last_name;
  //   if (description) userCollectionData.description = description;
  //   if (avatar) userCollectionData.avatar = avatar;


  //   const [ location, setLocation] = useState(user.location);
  //   const [ password, setPassword] = useState(user.password);
  // const edit = async ()=>{editeProfile(user.id)}  
  //   const submitForm = async (e) => {
  //       e.preventDefault();
  //      await editeProfile(userCollectionData , user.id , avatar)
       
  //      router.refresh();
      
  //   }

  // -------------------------------------
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarPath || "/placeholder.svg"} alt={full_name} />
              <AvatarFallback>{full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="capitalize">{full_name}</CardTitle>
                {user2?.verified && <Verified className="h-4 w-4 text-[#49c5b6]" />}
              </div>

              <CardDescription>Member since {user2?.date_created}</CardDescription>
              {/* {new Date(user2?.date_created)?.toISOString()?.split("T")[0]} */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{`${user2?.country }, ${user2?.city }, ${user2?.street }` || "No location set"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{user2?.rating ? `${user2?.rating.toFixed(1)} / 5.0 rating` : "No ratings yet"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                <span>{!user2?.completedSwaps  ? 'No completed swaps':`${user2?.completedSwaps} completed swaps` } </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {/* <span>Joined {formatDate(user.createdAt)}</span> */}
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`profile/settings/editProfile`}>Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
{/* ----------------------------------------------------------- */}

 <div className="md:col-span-2">
          <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Available Items</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">{myAvailableItems.length}</span>
              </TabsTrigger>
              <TabsTrigger value="offers" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Offers</span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">{userOffers.length}</span>
              </TabsTrigger>
              <TabsTrigger value="special" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Items In Offers  </span>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">{myUnavailableItems.length}</span>

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
            
              
              <ItemsList items={myAvailableItems} showFilters={false} />
            </TabsContent>

            <TabsContent value="offers" className="mt-6">
              <h2 className="mb-4 text-xl font-bold">My Offers</h2>
              {userOffers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="mb-2 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">No Offers Yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You don't have any offers yet. Browse items and make an offer!
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/">Browse Items</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userOffers.map((offer , index) => (
                    <Card key={offer.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Offer #{index}</CardTitle>
                        <CardDescription>
                          {formatDate(offer.date_created)} • Status:{" "}
                          <span className="font-medium text-amber-500">{offer.status}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                         
                          <div>
                                <p className="mb-2 text-sm font-medium">You Offer:</p>
                              {swapItems.filter(u => u.user_id === offer.from_user_id)?.map((item)=>(
            <OfferCard key={item.id} {...item}/>
                        ))}
                        
                            

                          </div>

                          <div>

{/* to useer  */}
                            <p className="mb-2 text-sm font-medium">For:</p>
                            
 {swapItems.filter(u => u.user_id === offer.to_user_id)?.map((item)=>(
            <OfferCard key={item.id} {...item}/>
                        ))}

                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() =>{}}>
                          View Details
                        </Button>
                        {offer.status === "Pending" && (
                          <>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                            <Button size="sm" onClick={() =>{}} >Accept</Button>
                          </>
                        )}
                      </CardFooter>
                    </Card>

                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="special" className="mt-6">
              <h2 className="mb-4 text-xl font-bold">Items On Offers</h2>
              <Card>
                <CardContent className="p-6">

                {myUnavailableItems.length>0? ( <ItemsList items={myUnavailableItems} showFilters={false} />)
                :
                ( <div className="mt-6">
                    
                    <div className="rounded-lg border p-4">
                      <p className="text-center text-sm text-muted-foreground">
                         Your have not items to get more visibility and offers.
                      </p>
                     
                    </div>
                  </div>)
                }
                

                 
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
{/* ----------------------------------------------------------- */}
        {/* Main Content */}
        {/* <div className="md:col-span-2">
          <Tabs defaultValue="items">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items">My Items</TabsTrigger>
              <TabsTrigger value="offers">My Offers</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>


            <TabsContent value="items" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
               {products.length > 0 ? (
                products.map((item) => (
                  //  <SmallCard key={item.id} {...item} />
                  <></>
                 
                ))
               ) :
                 (<>
                <h3 className="mb-2 text-lg font-medium">You haven't listed any items yet</h3>
                <p className="mb-4 text-muted-foreground">
                  Start listing items you want to swap to participate in the marketplace.
                </p>
                </> )
               }
                <Button className="bg-[#49c5b6] hover:bg-[#3db6a7]" asChild>
                  <Link href="/items/new">List Your First Item</Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="offers" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No offers yet</h3>
                <p className="mb-4 text-muted-foreground">
                  You haven't made or received any offers. Browse the marketplace to find items to swap.
                </p>
                <Button className="bg-[#49c5b6] hover:bg-[#3db6a7]" asChild>
                  <Link href="/">Browse Marketplace</Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="rounded-lg border p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No reviews yet</h3>
                <p className="text-muted-foreground">
                  Complete swaps with other users to start building your reputation.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div> */}
 {/* Main Content */}
      

      </div>
    </div>
  )
}


// ---------------------------------------

const OfferCard = ({
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

  useEffect(() => {
    getDataImage()
  }
  , [images , id])
  return(
     
    <>
<div>
                        
                   
                              <div key={id} className="flex items-center gap-3">
                                <div className="relative h-12 w-12 overflow-hidden rounded">
                                  <Image
                                   src={`http://localhost:8055/assets/${bigImage}`|| "/placeholder.svg"}
                                    alt={ name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{name}</p>
                                  <p className="text-sm font-medium">{status_item}</p>
                                  <p className="text-xs text-muted-foreground">
                                   {price}
                                  </p>
                                </div>
                              </div>
                         
                         
                              <div className="mt-2 text-sm">
                                <span className="font-medium">AI  Value Estimate: {value_estimate}</span>
                                
                              </div>
                      
                          </div>
    </>
  )
}

const ItemsInOfferCard = ({
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

  useEffect(() => {
    getDataImage()
  }
  , [images , id])
  return(
     
    <>
    <Link href={`products/${id}`} className="py-2">
     <div key={id} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded">
                          <Image
                            src={`http://localhost:8055/assets/${bigImage}`|| "/placeholder.svg"}
                            alt={name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{name}</p>
                          <p className="text-sm text-muted-foreground">
                          Price:  {price}LE
                          </p>
                          <Badge className="mt-1">{category}</Badge>
                        </div>

                      </div>
    
    </Link>
   
                     
              
    </>
  )
}

             
// -----------------------------------------

 
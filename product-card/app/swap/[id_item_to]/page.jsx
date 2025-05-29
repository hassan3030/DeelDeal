"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"
import { getProductById , getProductByUserId , getProductsOwnerById , getImageProducts, addOffer, getOfferById } from "@/callAPI/products"
import { getUserById } from "@/callAPI/users"
import { decodedToken, getCookie } from "@/callAPI/utiles"
import { notFound, useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { getUserByProductId } from "@/callAPI/users"



// Mock data for user's items
const userItems = [
  {
    id: "u1",
    name: "iPhone 13 Pro Max",
    description: "Good condition, 256GB, Graphite",
    price: 800,
    image: "/placeholder.svg?height=200&width=200&text=iPhone",
  },
  {
    id: "u2",
    name: "MacBook Air M1",
    description: "Like new, 8GB RAM, 256GB SSD",
    price: 700,
    image: "/placeholder.svg?height=200&width=200&text=MacBook",
  },
  {
    id: "u3",
    name: "Sony WH-1000XM4",
    description: "Noise cancelling headphones, black",
    price: 200,
    image: "/placeholder.svg?height=200&width=200&text=Headphones",
  },
]



export default function SwapPage() {
  const [selectedUserItems, setSelectedUserItems] = useState([])
  const [selectedAvailableItem, setSelectedAvailableItem] = useState([])
  const [swapStep, setSwapStep] = useState(1)
  const { isRTL } = useLanguage()
  const { t } = useTranslations()
  const [myProducts , setMyProducts] =  useState([])
   const [ownerProducts , setOwnerProducts] =  useState([])
   const [product , setProduct] =  useState([])
  const [images , setImages] =  useState([])
  const [user , setUser] =  useState({})
  const [name , setName] =  useState('')
  const [avatar , setAvatar] =  useState('')
  const [message , setMessage] =  useState('')
  const [swapHistory , setSwapHistory] =  useState([])
  const [usersOffer , setUsersOffer] =  useState([])
  const { toast } = useToast()
  const [userItemsValue , setUserItemsValue]=useState(0)
  const [availableItemValue , setAvailableItemValue]=useState(0)
  const [valueDifference , setValueDifference]=useState(0)
 const params = useParams();
  const router = useRouter();
  const id = params.id_item_to;
  

  // ------------------------------------

  // Function to get my products by ID from
const getMyProducts = async()=>{
const token = await getCookie()
    if(token){
     const myProductsData = await getProductByUserId()
     const availableMyProducts = myProductsData.filter(item => item.status_swap === "available");
     setMyProducts(availableMyProducts)
    }
    else{
      router.push(`/auth/login`)
    } 

  }


  // swap history 
 const getSwapHistory = async () => {
    const token = await getCookie()
    if (token) {
      const {id} = await decodedToken(token)
      // get my offers 
     const offers = await getOfferById(id);
     const users = await Promise.all(
    offers.map(swap => getUserById(swap.to_user_id))
  );
  setUsersOffer(users);
  console.log("setUsersOffer", users);
console.log("getSwapHistory offers ", offers);
setSwapHistory(offers);
    
    }
  }

  // Function to get product for another user by ID to
const getOwnerProducts = async()=>{
    if(id){
      // get owner products
     const ownerProductsData = await getProductsOwnerById(id)
// const availableOwnerProducts = ownerProductsData.filter(item => item.status_swap === "available");
//filter my categories 
const myAllowedCategories = myProducts.map(item => item.allowed_categories); 

const availableOwnerProducts = ownerProductsData.filter(item =>
  item.status_swap === "available" &&
  (item.allowed_categories === "all" || myAllowedCategories.includes(item.allowed_categories))
);
// const availablCategory = availableOwnerProducts.filter(item => item.category === "all");
setOwnerProducts(availableOwnerProducts)
     console.log('ownerProductsData' , availableOwnerProducts)
    }
    else{
      // router.push(`/auth/login`)
    } 

  }

  // Function to get product for another user by ID 
const getUsersSwaps = async () => {
 
};

  

  // showDetailes item
  const showDetailes = (e ,id)=>{
 e.preventDefault();
   e.stopPropagation();
       router.push(`/products/${id}`)

  }

  // handle checked my items
  const handleUserItemToggle = (item) => {
    
    
      if(item.allowed_categories === "all" || myAllowedCategories.includes(item.allowed_categories)){
        setSelectedUserItems((prev) =>
    prev.some((i) => i.id === item.id )
      ? prev.filter((i) => i.id !== item.id) // remove if already selected
      : [...prev, item] // add if not selected
  );
      }

 


  
  

};

// handle checked owner items
 const handleAvailableItemSelect = (item) => {
if(!selectedUserItems){
      toast({
        title: t("worning") || "Worning",
        description:  "Select your Products firstly to swap ",
        variant:"destructive"
      })
    }
    else{
      if(item.allowed_categories === "all" || myAllowedCategories.includes(item.allowed_categories)){


  setSelectedAvailableItem((prev) =>
    prev.some((i) => i.id === item.id)
      ? prev.filter((i) => i.id !== item.id) // remove if already selected
      : [...prev, item] // add if not selected
  );
  }
      else{
        toast({
        title: t("worning") || "Worning",
        description:  "Select Products Suitable With Your Category ",
        variant:"destructive"
      })
      }
 


    }
  }

//add offers 

const handleAddOffer = async () =>{
  // e.preventDefault();
const to_user = await getUserByProductId(id)
  await addOffer(to_user.id , valueDifference , selectedUserItems ,   selectedAvailableItem , message )
  

}
  // handle checked owner items
  // const handleAvailableItemSelect = (itemId) => {
  //   setSelectedAvailableItem(itemId)
  // }

 
  // -----------------------------------



useEffect(() => {
 getMyProducts()
 getOwnerProducts()
 getSwapHistory()
 getUsersSwaps()
  } , [params.id])

useEffect(() => {
  console.log("setSelectedUserItems", selectedUserItems);
  console.log("selectedAvailableItem", selectedAvailableItem);

// Calculate total value of selected user items
  const userValue = selectedUserItems.reduce((sum, item) => sum + (item.price || 0), 0);
  setUserItemsValue(userValue);

  // Calculate total value of selected available items
  const availableValue = selectedAvailableItem.reduce((sum, item) => sum + (item.price || 0), 0);
  setAvailableItemValue(availableValue);

  // Calculate value difference
  setValueDifference(userValue - availableValue);

  getUsersSwaps()
}, [selectedUserItems , selectedAvailableItem]);
  // ------------------------------------




  


  const handleNextStep = () => {
    setSwapStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setSwapStep((prev) => prev - 1)
  }

  const handleSubmitSwap = async () => {
 await  handleAddOffer()
toast({
        title: t("successSwap") || "Success Swap",
        description:  "yoyr swap is Success",
      }) 
     
      router.refresh() 
setSwapStep(1)
setSelectedUserItems([])
setSelectedAvailableItem([])
  }

  

  // Calculate total values
  

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">{t("swapTitle")}</h1>
      <p className="mb-8 text-muted-foreground">{t("swapDescription")}</p>

      <Tabs defaultValue="swap">
        <TabsList className="mb-8">
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="history">{t("swapHistory")}</TabsTrigger>
        </TabsList>

        <TabsContent value="swap">
          {swapStep === 1 && (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Your Items */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("yourItems")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProducts.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                        <Checkbox
                           id={`user-item-${item.id}`}
  checked={selectedUserItems.some((i) => i.id === item.id)}
  onCheckedChange={() => handleUserItemToggle(item)}
   />
                       <SwapItemCard {...item}/>
                      </div>
                    ))}

                    {myProducts.length === 0 && (
                      <div className="rounded-lg border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">You don't have any items to swap.</p>
                        <Button className="mt-4 bg-primary-orange text-white hover:bg-deep-orange" asChild>
                          <Link href="/items/new">Add Your First Item</Link>
                        </Button>
                      </div>
                    )}
                  </div>

                  {myProducts.length > 0 && (
                    <div className="mt-6 flex justify-between">
                      <p>Selected: {selectedUserItems.length} items</p>
                      <p>Total value: ${userItemsValue}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Items */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("availableItems")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ownerProducts.map((item) => (
                      <div
                        key={item.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${
                          selectedAvailableItem === item.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        // onClick={() => handleAvailableItemSelect(item.id)}
                      >
                         <Checkbox
                           id={`user-item-${item.id}`}
  checked={selectedAvailableItem.some((i) => i.id === item.id)}
  onCheckedChange={() => handleAvailableItemSelect(item)}
  
   />
   
                        <SwapItemCard {...item}/>
                         
                        <p className="mt-1 font-semibold hover:bg-yellow-200 p-1  rounded-sm"  onClick={(e)=>{showDetailes(e , item.id)}} >More...</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {swapStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("swapDetails")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Your Items */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Your Items</h3>
                    <div className="space-y-4">
                      {userItems
                        .filter((item) => selectedUserItems.includes(item.id))
                        .map((item) => (
                          <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <p className="mt-1 font-semibold">${item.price}</p>
                            </div>
                          </div>
                        ))}
                      <div className="rounded-lg bg-muted p-4">
                        <p className="font-medium">Total Value: ${userItemsValue}</p>
                      </div>
                    </div>
                  </div>

                  {/* Selected Available Item */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Item You'll Receive</h3>
                    {selectedAvailableItem && (
                      <>

                      {
                        selectedAvailableItem.map((item)=>{
                          return (
 <div  key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
<SwapItemCard {...item}/>
                        </div>
                          )
                        })
                      }
                       
                        <div className="mt-4 rounded-lg bg-muted p-4">
                          <p className="font-medium">Total Value: ${availableItemValue}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Value Difference */}
                <div className="mt-8 rounded-lg border p-4">
                  <h3 className="mb-2 text-lg font-medium">Value Difference</h3>
                  <div className="flex items-center justify-between">
                    <p>Your items: ${userItemsValue}</p>
                    <p>Their item: ${availableItemValue}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between font-bold">
                    <p>Difference:</p>
                    <p className={valueDifference < 0 ? "text-red-500" : valueDifference > 0 ? "text-green-500" : ""}>
                     
                      {valueDifference > 0 ? "you will take: " : valueDifference < 0 ? "you will pay: " : "(equal value) "}
                       ${Math.abs(valueDifference)}{" "}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="mt-8">
                  <h3 className="mb-2 text-lg font-medium">Message to Owner</h3>
                  <textarea
                    className="w-full rounded-md border p-2"
                    rows={4}
                    placeholder="Write a message to the owner explaining why you want to swap..."
                    value={message}
                    onChange={(e) =>{setMessage(e.target.value)}}
                  ></textarea>
                  {message}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {swapStep > 1 ? (
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {swapStep === 1 ? (
              <Button
                className="bg-primary-orange text-white hover:bg-deep-orange"
                onClick={handleNextStep}
                disabled={selectedUserItems.length === 0 || !selectedAvailableItem || selectedAvailableItem.length === 0}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-primary-orange text-white hover:bg-deep-orange" onClick={handleSubmitSwap}>
                Submit Swap Request
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t("swapHistory")}</h2>

            {swapHistory.length > 0 ? (
              <div className="space-y-4">
                {swapHistory.map((swap , index) => (
                  <Card key={swap.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{  new Date(swap?.date_created ).toISOString().split("T")[0]}</p>
                          <h3 className="font-medium">Swap with: {
    usersOffer.find(u => u.id === swap.to_user_id)?.first_name || `Not Name`}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                swap.status_offer === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : ( swap.status_offer === "pending" ?'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-red-600 text-yellow-800 dark:bg-red-500 dark:text-yellow-100') 
                              }`}
                            >
                              {swap.status_offer}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:items-end">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">
                              { swap.cash_adjustment>0?`Take: ${ Math.abs(Math.floor(swap.cash_adjustment))}`: ( swap.cash_adjustment===0?`Product Have The Same Price`:`Pay: ${ Math.abs(Math.floor(swap.cash_adjustment))}`)} </span>
                            
                          </div>
                         
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">You haven't made any swaps yet.</p>
                <Button className="mt-4 bg-primary-orange text-white hover:bg-deep-orange">Start Swapping</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}



const SwapItemCard = ({
  name,
    id,
    description,
    price,
    images,
    allowed_categories,
}
) => {
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
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image src={`http://localhost:8055/assets/${bigImage}` || "/placeholder.svg"} alt={name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <label htmlFor={`user-item-${id}`} className="block font-medium">
                          
                             <span className="capitalize">{name}</span>
                          </label>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            <span className="capitalize">{description}</span>
                            </p>
                          <p className="mt-1 font-semibold">Price: <span className="capitalize">{price}</span> LE</p>
                          <p className="mt-1 font-semibold"> Allowed Categories: Available for <span className="capitalize">{allowed_categories}</span></p>
                        
                        </div>
                      
                        </div>
  )
}


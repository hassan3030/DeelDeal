// import Image from "next/image"
// import Link from "next/link"
// import { notFound } from "next/navigation"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   ArrowLeft,
//   ArrowLeftRight,
//   Calendar,
//   Heart,
//   MapPin,
//   MessageCircle,
//   Share2,
//   Star,
//   User,
//   Verified,
// } from "lucide-react"
// import type { Category } from "@/components/item-card"

// // Mock data for demonstration
// const mockItems = [
//   {
//     id: "1",
//     name: 'MacBook Pro 16" 2021 M1 Pro',
//     description:
//       "Excellent condition MacBook Pro with M1 Pro chip, 16GB RAM, 512GB SSD. Includes charger and original box. Only used for light web browsing and document editing. No scratches or dents. Battery health at 98%.",
//     images: [
//       "/placeholder.svg?height=600&width=600&text=MacBook+Pro+Front",
//       "/placeholder.svg?height=600&width=600&text=MacBook+Pro+Side",
//       "/placeholder.svg?height=600&width=600&text=MacBook+Pro+Open",
//     ],
//     category: "Electronics" as Category,
//     valueEstimate: 1800,
//     allowedCategories: ["Electronics", "RealEstate", "Vehicles"] as Category[],
//     owner: {
//       id: "user1",
//       name: "Alex Johnson",
//       avatar: "/placeholder.svg?height=40&width=40&text=AJ",
//       rating: 4.8,
//       verified: true,
//       memberSince: "2021-06-15",
//       completedSwaps: 24,
//     },
//     location: "San Francisco, CA",
//     createdAt: "2023-04-15T14:30:00Z",
//     condition: "Like New",
//     additionalDetails: {
//       Brand: "Apple",
//       Model: "MacBook Pro 16-inch",
//       Year: "2021",
//       Processor: "M1 Pro (10-core)",
//       RAM: "16GB",
//       Storage: "512GB SSD",
//       Display: "16-inch Liquid Retina XDR",
//       "Battery Cycles": "45",
//       Warranty: "AppleCare+ until June 2024",
//     },
//   },
// ]

// // Function to get item by ID
// const getItem = (id: string) => {
//   return mockItems.find((item) => item.id === id)
// }

// // Format date
// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   })
// }

// // Format currency
// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(value)
// }

// export default function ItemPage({ params }: { params: { id: string } }) {
//   const item = getItem(params.id)

//   if (!item) {
//     notFound()
//   }

//   return (
//     <div className="container py-10">
//       <div className="mb-6 flex items-center gap-2">
//         <Button variant="ghost" size="sm" asChild>
//           <Link href="/">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to marketplace
//           </Link>
//         </Button>
//       </div>

//       <div className="grid gap-8 md:grid-cols-2">
//         {/* Item Gallery */}
//         <div className="flex flex-col gap-4">
//           <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
//             <Image
//               src={item.images[0] || "/placeholder.svg"}
//               alt={`${item.name} - Main Image`}
//               fill
//               className="object-contain"
//               priority
//             />
//           </div>

//           <div className="flex gap-2 overflow-auto pb-2">
//             {item.images.map((image, index) => (
//               <div key={index} className="relative aspect-square h-20 overflow-hidden rounded-md border">
//                 <Image
//                   src={image || "/placeholder.svg"}
//                   alt={`${item.name} thumbnail ${index + 1}`}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Item Info */}
//         <div className="flex flex-col gap-4">
//           <div>
//             <div className="flex items-start justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold">{item.name}</h1>
//                 <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <MapPin className="h-4 w-4" />
//                     <span>{item.location}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Calendar className="h-4 w-4" />
//                     <span>Listed on {formatDate(item.createdAt)}</span>
//                   </div>
//                 </div>
//               </div>
//               <Badge
//                 variant="outline"
//                 className="bg-[#49c5b6] text-white border-[#49c5b6] hover:bg-[#3db6a7] hover:text-white hover:border-[#3db6a7]"
//               >
//                 {item.category}
//               </Badge>
//             </div>

//             <div className="mt-4 flex items-center gap-4">
//               <div className="text-3xl font-bold">{formatCurrency(item.valueEstimate)}</div>
//               <Badge variant="outline" className="text-sm">
//                 Condition: {item.condition}
//               </Badge>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <Button className="gap-2 bg-[#49c5b6] hover:bg-[#3db6a7]">
//               <ArrowLeftRight className="h-4 w-4" />
//               Make Offer
//             </Button>
//             <Button variant="outline" className="gap-2">
//               <MessageCircle className="h-4 w-4" />
//               Contact Owner
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Heart className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Share2 className="h-5 w-5" />
//             </Button>
//           </div>

//           <Separator />

//           <div>
//             <h3 className="mb-2 font-medium">Will swap for:</h3>
//             <div className="flex flex-wrap gap-2">
//               {item.allowedCategories.map((cat) => (
//                 <Badge key={cat} variant="secondary" className="text-sm">
//                   {cat}
//                 </Badge>
//               ))}
//             </div>
//           </div>

//           <Separator />

//           <div className="flex items-center gap-3">
//             <Avatar className="h-12 w-12">
//               <AvatarImage src={item.owner.avatar || "/placeholder.svg"} alt={item.owner.name} />
//               <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold">{item.owner.name}</span>
//                 {item.owner.verified && <Verified className="h-4 w-4 text-[#49c5b6]" />}
//               </div>
//               <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <span>{item.owner.rating.toFixed(1)}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <ArrowLeftRight className="h-4 w-4" />
//                   <span>{item.owner.completedSwaps} swaps</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <User className="h-4 w-4" />
//                   <span>Member since {formatDate(item.owner.memberSince)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator />

//           <Tabs defaultValue="description">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="description">Description</TabsTrigger>
//               <TabsTrigger value="details">Details</TabsTrigger>
//               <TabsTrigger value="shipping">Shipping</TabsTrigger>
//             </TabsList>
//             <TabsContent value="description" className="mt-4">
//               <p className="whitespace-pre-line">{item.description}</p>
//             </TabsContent>
//             <TabsContent value="details" className="mt-4">
//               <div className="grid gap-2">
//                 {Object.entries(item.additionalDetails).map(([key, value]) => (
//                   <div key={key} className="grid grid-cols-2 gap-4 border-b py-2">
//                     <span className="font-medium">{key}</span>
//                     <span>{value}</span>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>
//             <TabsContent value="shipping" className="mt-4">
//               <p>This item is available for local pickup in {item.location}.</p>
//               <p className="mt-2">For shipping arrangements, please contact the owner directly.</p>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }

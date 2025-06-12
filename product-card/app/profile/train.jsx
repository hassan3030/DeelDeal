//  <TabsContent value="offers" className="mt-6">
//               <h2 className="mb-4 text-xl font-bold">My Offers</h2>
//               {userOffers.length === 0 ? (
//                 <Card>
//                   <CardContent className="flex flex-col items-center justify-center py-8 text-center">
//                     <Clock className="mb-2 h-12 w-12 text-muted-foreground" />
//                     <p className="text-lg font-medium">No Offers Yet</p>
//                     <p className="mt-1 text-sm text-muted-foreground">
//                       You don't have any offers yet. Browse items and make an offer!
//                     </p>
//                     <Button asChild className="mt-4">
//                       <Link href="/">Browse Items</Link>
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-4">
//                   {userOffers.map((offer , index) => (
//                     <Card key={offer.id}>
//                       <CardHeader>
//                         <CardTitle className="text-lg">Offer #{index}</CardTitle>
//                         <CardDescription>
//                           {formatDate(offer.date_created)} • Status:{" "}
//                           <span className="font-medium text-amber-500">{offer.status_offer}</span>
//                         </CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                         
//                           <div>
//                                 <p className="mb-2 text-sm font-medium">You Offer:</p>
//                               {swapItems.filter(u => u.user_id === offer.from_user_id)?.map((item)=>(
//             <OfferCard key={item.id} {...item}/>
//                         ))}
                        
                            

//                           </div>

//                           <div>

// {/* to useer  */}
//                             <p className="mb-2 text-sm font-medium">For:</p>
                            
//  {swapItems.filter(u => u.user_id === offer.to_user_id)?.map((item)=>(
//             <OfferCard key={item.id} {...item}/>
//                         ))}

//                           </div>
//                         </div>
//                       </CardContent>
//                       <CardFooter className="flex justify-end gap-2">
//                         <Button variant="outline" size="sm" onClick={() =>{}}>
//                           View Details
//                         </Button>
//                         {offer.status === "Pending" && (
//                           <>
//                             <Button variant="destructive" size="sm">
//                               Delete
//                             </Button>
//                             <Button size="sm" onClick={() =>{}} >Accept</Button>
//                           </>
//                         )}
//                       </CardFooter>
//                     </Card>

//                   ))}
//                 </div>
//               )}
//             </TabsContent>







// <TabsContent value="offers" className="mt-6">
//   <h2 className="mb-4 text-xl font-bold">My Offers</h2>
//   {userOffers.length === 0 ? (
//     <Card>
//       <CardContent className="flex flex-col items-center justify-center py-8 text-center">
//         <Clock className="mb-2 h-12 w-12 text-muted-foreground" />
//         <p className="text-lg font-medium">No Offers Yet</p>
//         <p className="mt-1 text-sm text-muted-foreground">
//           You don't have any offers yet. Browse items and make an offer!
//         </p>
//         <Button asChild className="mt-4">
//           <Link href="/products">Browse Items</Link>
//         </Button>
//       </CardContent>
//     </Card>
//   ) : (
//     <div className="space-y-4">
//       {userOffers.map((offer, index) => {
//         // Choose bg color based on status
//         let statusBg = "";
//         if (offer.status_offer === "pending") statusBg = "bg-yellow-50";
//         else if (offer.status_offer === "accepted") statusBg = "bg-green-50";
//         else if (offer.status_offer === "rejected") statusBg = "bg-red-50";
//         else if (offer.status_offer === "completed") statusBg = "bg-blue-50";
//         else statusBg = "bg-muted";

//         // Find the user for this offer (from userSwaps)
//         const offerUser = userSwaps.find(
//           (u) => u.id === offer.to_user_id || u.id === offer.from_user_id
//         );

//         return (
//           <Card key={offer.id} className={`${statusBg} border`}>
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center gap-2">
//                 Offer #{index + 1}
//                 <span
//                   className={`font-medium px-2 py-1 rounded 
//                     ${
//                       offer.status_offer === "pending"
//                         ? "bg-yellow-200 text-yellow-800"
//                         : offer.status_offer === "accepted"
//                         ? "bg-green-200 text-green-800"
//                         : offer.status_offer === "rejected"
//                         ? "bg-red-200 text-red-800"
//                         : offer.status_offer === "completed"
//                         ? "bg-blue-200 text-blue-800"
//                         : "bg-gray-200 text-gray-800"
//                     }
//                   `}
//                 >
//                   {offer.status_offer}
//                 </span>
//               </CardTitle>
//               <CardDescription>
//                 {formatDate(offer.date_created)}
//               </CardDescription>
//               {/* Display user info if offer is pending or accepted */}
//               {(offer.status_offer === "pending" || offer.status_offer === "accepted") && offerUser && (
//                 <div className="flex items-center gap-2 mt-2">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage
//                       src={
//                         offerUser.avatar
//                           ? `http://localhost:8055/assets/${offerUser.avatar}`
//                           : "/placeholder.svg"
//                       }
//                       alt={offerUser.first_name}
//                     />
//                     <AvatarFallback>
//                       {offerUser.first_name?.[0] || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="font-medium">
//                     {offerUser.first_name} {offerUser.last_name}
//                   </span>
//                 </div>
//               )}
//             </CardHeader>
//             {/* Display items if offer is pending or accepted */}
//             {(offer.status_offer === "pending" || offer.status_offer === "accepted") && (
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
//                   {/* You Offer */}
//                   <div>
//                     <p className="mb-2 text-sm font-medium">You Offer:</p>
//                     {swapItems
//                       .filter(
//                         (u) =>
//                           u.offer_id === offer.id &&
//                           u.user_id === offer.from_user_id
//                       )
//                       .map((item) => (
//                         <OfferCard key={item.id} {...item} />
//                       ))}
//                   </div>
//                   {/* For */}
//                   <div>
//                     <p className="mb-2 text-sm font-medium">For:</p>
//                     {swapItems
//                       .filter(
//                         (u) =>
//                           u.offer_id === offer.id &&
//                           u.user_id === offer.to_user_id
//                       )
//                       .map((item) => (
//                         <OfferCard key={item.id} {...item} />
//                       ))}
//                   </div>
//                 </div>
//               </CardContent>
//             )}
//             <CardFooter className="flex justify-end gap-2">
//               <Button variant="outline" size="sm" onClick={() => {}}>
//                 View Details
//               </Button>
//               {offer.status_offer === "pending" && (
//                 <>
//                   <Button variant="destructive" size="sm">
//                     Delete
//                   </Button>
//                   <Button size="sm" onClick={() => {}}>
//                     Accept
//                   </Button>
//                 </>
//               )}
//             </CardFooter>
//           </Card>
//         );
//       })}
//     </div>
//   )}
// </TabsContent>
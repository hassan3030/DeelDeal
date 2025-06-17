"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/use-translations";

import {
  Send,
  Search,
  MessageCircle,
  ArrowLeft,
  ShoppingCart,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getOfferById,
  getOffersNotifications,
  getMessage,
  addMessage,
} from "@/callAPI/swap";
import { getUserById } from "@/callAPI/users";
import { getCookie, decodedToken } from "@/callAPI/utiles";

const Messages = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [myUserId, setMyUserId] = useState(null);
  const { t } = useTranslations();

  // Fetch my offers (sent and received) on mount
  useEffect(() => {
    const fetchOffers = async () => {
      const token = await getCookie();
      if (!token) return;
      const { id } = await decodedToken(token);
      setMyUserId(id);

      // Get offers where I am sender
      const sentOffers = await getOfferById(id);
      // Get offers where I am receiver
      const receivedOffers = await getOffersNotifications(id);

      // Combine and remove duplicates (by offer id)
      const allOffers = [...sentOffers, ...receivedOffers].filter(
        (offer, idx, arr) => arr.findIndex((o) => o.id === offer.id) === idx
      );

      // Attach partner info to each offer
      const offersWithPartner = await Promise.all(
        allOffers.map(async (offer) => {
          const partnerId =
            offer.from_user_id === id ? offer.to_user_id : offer.from_user_id;
          const partnerUser = await getUserById(partnerId);
          return {
            ...offer,
            partner_id: partnerId,
            partner_name: partnerUser
              ? `${partnerUser.first_name} ${partnerUser.last_name || ""}`
              :`${t("Unknown")||"Unknown"}`,
            partner_avatar: partnerUser?.avatar || "/placeholder.svg",
          };
        })
      );
      setOffers(offersWithPartner);
    };
    fetchOffers();
  }, []);

  // When an offer is selected, fetch partner and messages
  useEffect(() => {
    const fetchPartnerAndMessages = async () => {
      if (!selectedOffer || !myUserId) return;
      // Partner info is already attached to offer
      const partnerUser = await getUserById(selectedOffer.partner_id);
      setPartner(partnerUser);

      // Fetch messages for this offer
      const msgs = await getMessage(selectedOffer.id);
      setMessages(msgs || []);
    };
    fetchPartnerAndMessages();
  }, [selectedOffer, myUserId]);

  // Filter offers by partner name
  const filteredOffers = offers.filter((offer) =>
    offer.partner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedOffer || !partner) return;
    const newMsg = await addMessage(
      message,
      selectedOffer.partner_id,
      selectedOffer.id
    );
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm  top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={"/"} className="text-2xl font-bold text-primary">
                DEELDEAL
              </Link>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {t("Messages")||"Messages"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Offers List */}
        <div
          className={`${
            selectedOffer ? "hidden lg:block" : "block"
          } w-full lg:w-1/3 border-r bg-card/30`}
        >
          <div className="p-4">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-6 w-6 mr-3 text-primary" />
              <h2 className="text-xl font-bold">  {t("Messages")||"Messages"} </h2>
            </div>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Offers List */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {filteredOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedOffer?.id === offer.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedOffer(offer)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center text-sm">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={
                                  `http://localhost:8055/assets/${offer.partner_avatar}` ||
                                  "/placeholder.svg"
                                }
                                alt={offer.partner_name || t("Unknown")}
                              />
                              <AvatarFallback>
                                {offer.partner_name?.[0] || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex flex-col ml-2">
                            <span className="px-1 text-gray-400 capitalize">
                              {offer.partner_name || ""}
                            </span>
                            <span className="px-1 text-gray-400 ">
                              {offer.last_message || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
            </ScrollArea>
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            selectedOffer ? "block" : "hidden lg:block"
          } flex-1 flex flex-col`}
        >
          {selectedOffer && partner ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-card/30">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSelectedOffer(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage
                        src={
                          `http://localhost:8055/assets/${partner.avatar}` ||
                          "/placeholder.svg"
                        }
                        alt={partner.first_name || t("User")||"User"}
                      />
                      <AvatarFallback>
                        {partner.first_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                
              
                  <div>
                    <h3 className="font-semibold capitalize">
                      {partner.first_name} {partner.last_name}
                    </h3>
                  </div>

                    {myUserId ===  selectedOffer.from_user_id? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary group"
                      onClick={() => {
       
                        router.push(`/cart#${selectedOffer.id}`);
                      }}
                    >
                      <ShoppingCart className="h-8 w-8" />
                      <span className="pointer-events-none absolute top-8 right-0 z-10 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                        {t("goToCart") || "Go to Cart"}
                      </span>
                    </Button>
                  ) : (
                  <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary group"
                      onClick={() => {
                        router.push(`/notifications#${selectedOffer.id}`);
                      }}
                    >
                      <Bell className="h-8 w-8" />
                      <span className="pointer-events-none absolute top-8 right-0 z-10 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                        {t("goToNotifications") || "Go to Notifications"}
                      </span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.from_user_id === myUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 ${
                          msg.from_user_id === myUserId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(msg.date_created).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-card/30">
                <div className="flex space-x-2">
                  <Input
                    placeholder={t("Typeyourmessage")||"Type your message..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("Selectaconversation")||"Select a conversation"}
                 
                </h3>
                <p className="text-muted-foreground">
             
                  {t("Chooseaswapoffertostartchatting")||"Select a conversation"}

                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone, HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";
import { addMessage } from "@/callAPI/users";

const CustomerService = () => {
  const { toast } = useToast();
  const { t } = useTranslations();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const addMessageData = async () => {
    await addMessage(email, name, message, phone_number);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === "" || email === "" || phone_number === "" || message === "") {
      toast({
        title: "Fill Data",
        description: "Please fill your iformation to send",
        variant: "destructive",
      });
    } else {
      addMessageData();
      setName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      toast({
        title: t("sendMessage") || "Your message sent!",
        description:
          t("messageDescription") ||
          "Your message has been sent! We'll get back to you soon.",
        variant: "primary",
      });
    }
  };

  useEffect(() => {
    // Reset form fields on component mount
    setName("");
    setEmail("");
    setPhoneNumber("");
    setMessage("");
  }, []);

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-[-2rem] mb-30">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-1">
          <ContactCard
            icon={<MessageCircle />}
            title={t("liveChat")}
            description={t("chatDescription")}
            actionText={t("startChat")}
            onClick={() => {
              toast({
                title: t("note") || "Note",
                description:
                  t("ifoDescription") || "Live chat feature coming soon!",
                variant: "destructive",
              });
            }}
          />
          <ContactCard
            icon={<Mail />}
            title={t("emailSupport")}
            description={t("emailDescription")}
            actionText={t("emailUs")}
            // in future we can add email link here
            onClick={() =>
              (window.location.href = "mailto:support@example.com")
            }
          />
          <ContactCard
            icon={<Phone />}
            title={t("callUs")}
            description={t("callDescription")}
            actionText={t("callNow")}
            // onClick={() => window.location.href = "tel:+00000000000"}
            onClick={() => {
              toast({
                title: t("note") || "Note",
                description:
                  t("ifoTelDescription") || "Phone  feature coming soon!",
                variant: "destructive",
              });
            }}
          />
        </div>

        {/* Support Options Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{t("faq")}</CardTitle>
                  <Badge variant="outline" className="font-normal">
                    <HelpCircle className="h-3.5 w-3.5 mr-1" />
                    Support
                  </Badge>
                </div>
                <CardDescription>{t("findAnswers")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>{t("resetPassword")}</AccordionTrigger>
                    <AccordionContent>
                      {t("resetPasswordAnswer")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>{t("paymentMethods")}</AccordionTrigger>
                    <AccordionContent>
                      {t("paymentMethodsAnswer")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      {t("cancelSubscription")}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t("cancelSubscriptionAnswer")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>{t("refundPolicy")}</AccordionTrigger>
                    <AccordionContent>
                      {t("refundPolicyAnswer")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>{t("gettingStarted")}</AccordionTrigger>
                    <AccordionContent>
                      {t("gettingStartedAnswer")}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("contactUs")}</CardTitle>
                <CardDescription>{t("sendMessage")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("name")}</Label>
                    <Input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      id="name"
                      placeholder={t("yourName")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      id="email"
                      type="email"
                      placeholder={t("yourEmail")}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">{t("phoneNumber")}</Label>
                    <Input
                      value={phone_number}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                      id="phone_number"
                      placeholder={t("phoneNumberPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("message")}</Label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      rows={4}
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder={t("messagePlaceholder")}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t("sendMessageBtn")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t("browseTopics")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <TopicCard title={t("accountBilling")} count={1} />
            <TopicCard title={t("productFeatures")} count={1} />
            <TopicCard title={t("technicalIssues")} count={1} />
            <TopicCard title={t("ordersShipping")} count={1} />
            <TopicCard title={t("returnsRefunds")} count={1} />
            <TopicCard title={t("privacySecurity")} count={1} />
          </div>
        </div>

        {/* CTA Section */}
        {/* in the future, this will be a carousel of CTAs */}
        {/* <div className="bg-gradient-to-r from-accent to-deep-orange dark:from-primary dark:to-accent rounded-xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-background mb-4">
            {t("stillNeedHelp")}
          </h2>
          <p className="text-background/90 mb-6 max-w-2xl mx-auto">
            {t("supportAvailable")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> {t("visitHelpCenter")}
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-background text-background hover:bg-background/10"
            >
              <MessageCircle className="mr-2 h-4 w-4" /> {t("communityForums")}
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Supporting component for contact cards
const ContactCard = ({ icon, title, description, actionText, onClick }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
          <div className="text-primary dark:text-primary-foreground">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button onClick={onClick} variant="outline" className="w-full">
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};

// Supporting component for topic cards
const TopicCard = ({ title, count }) => {
  return (
    <Card className="transition-all hover:shadow-md cursor-pointer hover:bg-secondary/5">
      <CardContent className="flex justify-between items-center p-4">
        <h3 className="font-medium">{title}</h3>
        <Badge variant="secondary" className="ml-2">
          {count}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default CustomerService;

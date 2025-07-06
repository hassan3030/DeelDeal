"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  User,
  Bell,
  Globe,
  Shield,
  CreditCard,
  Upload,
  CirclePlus,
  Navigation,
  Loader2,
  MapPin,
} from "lucide-react";
import { editeProfile, getUserById, resetPassword } from "@/callAPI/users";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { decodedToken, getCookie } from "@/callAPI/utiles";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslations } from "@/lib/use-translations";
import { useTheme } from "@/lib/theme-provider";
import { useToast } from "@/components/ui/use-toast";
import { ItemListingForm } from "@/components/item-listing-form";
import { z } from "zod";

export default function ProfileSettingsPage() {
  // -----------------------------------------
  const { toast } = useToast();
  // toast({
  //   title: "Item Deleted",
  //   description: "The item has been successfully deleted.",
  //   variant: "success", // Assuming your toast supports variants like 'success', 'error', etc.
  // })

  const [currentEmail, setCurrentEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: t("error") || "Error",
        description:t("faileChangePassword") || "Please fill in all password fields",
        variant: "destructive",
      });
    } else if (newPassword !== confirmPassword) {
      toast({
        title:t("error") || "Error",
        description:  t("notMach") || "New passwords do not match.",
        variant: "destructive",
      });
    } else if (newPassword === confirmPassword) {
      try {
        const Password = await resetPassword(newPassword, currentEmail);
        if (Password) {
          toast({
            title: t("error") || "Error",
            description:  t("successChangePassword") || "Your password has been updated successfully.",
            variant: "success",
          });
          setCurrentEmail("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        toast({
          title: t("error") || "Error",
          description:t("faildChangePassword") || "Error updating password..",
          variant: "success",
        });
      }
    } else {
      toast({
        title: t("error") || "Error",
        description: t("faildChangePassword") ||"SomeThing Error When updating password..",
        variant: "success",
      });
    }
  };

  const { theme, toggleTheme } = useTheme();


  // const pathname = usePathname()

  const { t } = useTranslations();
  const params = useParams();

  const router = useRouter();
  const [user, setUser] = useState({});

  const [avatar, setAvatar] = useState(null);
  const [avatarPath, setAvatarPath] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLasttName] = useState("");
  const [gender, setGender] = useState("");
  const [phone_number, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [post_code, setPostCode] = useState("");
  const [geo_location, set_geo_location] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const mapInstanceRef = useRef(null);


  const getUser = async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken(token);
      const userData = await getUserById(id);
      setUser(userData);
    }
  };

  const profileSchema = z.object({
    phone_number: z
      .string()
      .min(8,t("PhoneIsShort")|| "Phone number is too short")
      .max(20,t("PhoneIsLong")||"Phone number is too long")
      .regex(/^\+?\d{8,20}$/, t("invalidNumber")||"Invalid phone number"),
    // ...other fields...
  });

  const result = profileSchema.safeParse({ phone_number });

  let userCollectionData = {};
  if (first_name) userCollectionData.first_name = first_name;
  if (last_name) userCollectionData.last_name = last_name;
  if (description) userCollectionData.description = description;
  if (avatar) userCollectionData.avatar = avatar;
  if (city) userCollectionData.city = city;
  if (country) userCollectionData.country = country;
  if (street) userCollectionData.street = street;
  if (post_code) userCollectionData.post_code = post_code;
  if (gender) userCollectionData.gender = gender;
  if (phone_number) userCollectionData.phone_number = phone_number;
  if (geo_location) userCollectionData.geo_location = geo_location;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  useEffect(() => {
    getUser();
    // getUserProducts()
  }, []);

  useEffect(() => {
    setAvatarPath(`http://localhost:8055/assets/${user.avatar}`);
    setFirstName(user.first_name || "");
    setLasttName(user.last_name || "");
    setGender(user?.gender || "");
    setPhone(user.phone_number || "");
    setDescription(user.description || "");
    setCountry(user?.country || "");
    setCity(user?.city || "");
    setStreet(user?.street || "");
    setPostCode(user?.post_code || "");
    set_geo_location(user?.geo_location || {});
  }, [user]);
  // -----------------------------------------

  const [formData, setFormData] = useState({
    first_name,
    last_name,
    phone_number,
    description,
    city,
    country,
    street,
    post_code,
    gender,
    geo_location,
  });
  //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userCollectionData) {
      toast({
        title: "wornning",
        description: t("noChangeSaved")||"No Change To saved",
        variant: "destructive",
      });
    } else {
      if (!result.success) {
        toast({
          title: "wornning",
          description: t("phoneNumberNotValidate") || "Phone number not validate",
          variant: "destructive", // Assuming your toast supports variants like 'success', 'error', etc.
        });
      } else {
        await editeProfile(userCollectionData, user.id, avatar);
        router.refresh();

        toast({
          title: t("successfully"),
          description: t("savedSuccessfully")|| "Settings saved successfully!", // Assuming your toast supports variants like 'success', 'error', etc.
        });
      }
    }
  };

  
  // map

  const getCurrentPosition = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title:t("error")|| "Error",
        description: t("geolocationNotSupported") || "Geolocation is not supported by this browser",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          name: "Current Location",
        };
        setCurrentPosition(pos);
        setSelectedPosition(pos);

 set_geo_location({
          lat: pos.lat,
          lng: pos.lng,
          accuracy: pos.accuracy,
          name: pos.name,
        });
        if (mapInstanceRef.current) {
          addMarker(pos);
        }

        setIsGettingLocation(false);
       
        toast({
          title:t("CurrentLocationFound") || "Current location found",
          description: `Lat: ${pos.lat.toFixed(6)}, Lng: ${pos.lng.toFixed(6)}`,
        });
      },
      (error) => {
        let message = t('Unabletoretrieveyourlocation')||"Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = t('Locationaccessdeniedbyuser')|| "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message = t('Locationinformationisunavailable')||  "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message = t('Locationrequesttimedout')||  "Location request timed out";
            break;
        }
        toast({
          title: message = t('LocationError')||"Location Error",
          description: message,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };
  
  return (
    <div className="container py-8">

          {/* Go Back Link */}
            <div className="inline mb-3 ">
              <Button
                className="mb-2" 
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
               <Link href="/profile">
            <ChevronLeft className="mr-1 h-4 w-4" />
          </Link>
              </Button>
              <h1 className="mx-2 text-3xl font-bold inline">{t("accountSettings")||"Account Settings"}</h1>
            </div>

{/* 
      <div className="mb-6 flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/profile">
            <ChevronLeft className="mr-1 h-4 w-4" />
            {t("goBack")}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{t("accountSettings")||"Account Settings"}</h1>
      </div> */}

      <Tabs defaultValue="profile" className="w-full">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <TabsList className="flex h-auto w-full flex-col items-start justify-start">
              <TabsTrigger
                value="profile"
                className="w-full justify-start text-left"
              >
                <User className="mr-2 h-4 w-4" />
                {t("profile")||"Profile"}
              </TabsTrigger>
              {/* in the future we can add more tabs here */}
              {/* <TabsTrigger value="notifications" className="w-full justify-start text-left">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger> */}
              <TabsTrigger
                value="preferences"
                className="w-full justify-start text-left"
              >
                <Globe className="mr-2 h-4 w-4" />
                {t("preferences")||"Preferences"}
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="w-full justify-start text-left"
              >
                <Shield className="mr-2 h-4 w-4" />
                {t("security")|| "Security"}
              </TabsTrigger>

              <TabsTrigger
                value="add"
                className="w-full justify-start text-left"
              >
                <CirclePlus className="mr-2 h-4 w-4" />
               {t("addItem")||"Add Item"}
              </TabsTrigger>
              {/* <TabsTrigger value="payment" className="w-full justify-start text-left">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </TabsTrigger> */}
            </TabsList>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t("profileInformation")||"Profile Information"}</CardTitle>
                  <CardDescription>
                   {t("UpdateProfileInformation")||" Update your profile information and how others see you on the platform."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <div className="mb-6 flex flex-col items-center space-y-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full">
                        <Image
                          src={avatarPath || "/placeholder.svg"}
                          alt={user?.first_name || "Unknown"}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {/* <Button type="button" variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4"  />
                        Change Photo
                      </Button> */}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">{t("firstName")||"First Name"}</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="last_name">{t("LastName")||"Last Name"}</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={last_name}
                            onChange={(e) => setLasttName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">{t("Country")||"Country"}</Label>
                          <Input
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">{t("City")||"City"}</Label>
                          <Input
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="street">{t("Street")||"Street"}</Label>
                          <Input
                            id="street"
                            name="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>

                        {/* get position map  */}

                        {/* Current Position */}

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Navigation className="h-5 w-5" />
                           {t("CurrentPosition")||"Current Position"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Button
                              onClick={getCurrentPosition}
                              disabled={isGettingLocation}
                              className="w-full"
                            >
                              {isGettingLocation ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 {t("GettingLocation")||" Getting Location..."}
                                </>
                              ) : (
                                <>
                                  <MapPin className="mr-2 h-4 w-4" />
                                 
                                       {t("GetCurrentLocation")||"Get Current Location"}
                                </>
                              )}
                            </Button>
                          </CardContent>

                          {selectedPosition && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5" />
                            
                                       {t("SelectedPosition")||"Selected Position"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <strong>{t("Name")||"Name"}:</strong>{" "}
                                    {selectedPosition.name}
                                  </p>
                                  <p className="text-sm">
                                    <strong>{t("Latitude")||"Latitude"}:</strong>{" "}
                                    {selectedPosition.lat.toFixed(6)}
                                  </p>
                                  <p className="text-sm">
                                    <strong>{t("Longitude")||"Longitude"}:</strong>{" "}
                                    {selectedPosition.lng.toFixed(6)}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Card>

                        {/* Selected Position */}

                        {/* end position map  */}
                        <div className="space-y-2">
                          <Label htmlFor="post_code">{t("PstalCode")||"Pstal Code"}</Label>
                          <Input
                            id="post_code"
                            name="post_code"
                            value={post_code}
                            onChange={(e) => setPostCode(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">{t("email")||"Email"}</Label>
                          <Input
                            disabled
                            id="email"
                            name="email"
                            type="email"
                            value={user.email}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">{t("phoneNumber")||"Phone Number"}</Label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={phone_number}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="avatar">{t("Avatar")||"Avatar"}</Label>
                          <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                          />
                        </div>
                      </div>

                      {/* <div className="mb-4">
            <label htmlFor="avatar" className="block text-gray-700 font-medium mb-2">Image</label>
            <input id="avatar" name="avatar" type="file" accept="image/*"
                placeholder="Enter your image URL"
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400" 
                onChange={(e) => setAvatar(e.target.files[0])}
                />
        </div>
                     */}

                      <div className="space-y-2">
                        <Label htmlFor="gender">{t("Gender")||"Gender"}</Label>
                        <Select
                          value={gender}
                          // onValueChange={(value) => handleChange({ target: { status: "gender", value } })}
                          onValueChange={(value) => setGender(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("SelectGender")||"Select Gender"}/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t("Male")||"Male"}</SelectItem>
                            <SelectItem value="female">{t("Female")||"Female"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">{t("descriptionProfile")||"Description"}</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {t("SaveChanges")||"Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              {/* in the future */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how and when you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications about offers, messages, and updates.
                        </p>
                      </div>
                      <Switch
                        checked={formData.notifications}
                        onCheckedChange={(checked) => handleSwitchChange("notifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive our newsletter with tips, new features, and special offers.
                        </p>
                      </div>
                      <Switch
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleSwitchChange("newsletter", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Offer Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone makes an offer on your items.
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Message Notifications</h3>
                        <p className="text-sm text-muted-foreground">Get notified when you receive new messages.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSubmit}>Save Changes</Button>
                </CardFooter>
              </Card> */}
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>{t("preferences")||"Preferences"}</CardTitle>
                  <CardDescription>
                    {t("Customizeyourexperience")||"Customize your experience on the platform."} 
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">   {t("DarkMode")||"Dark Mode"} </h3>
                        <p className="text-sm text-muted-foreground">
                           {t("Customizeyourexperience")||"Customize your experience on the platform."} 
                        </p>
                      </div>
                      <Switch
                        checked={formData.darkMode}
                        onClick={() => toggleTheme()}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("darkMode", checked)
                        }
                      />
                    </div>
                    {/* in the future we can add more preferences here */}
                    <LanguageToggle />
                    {/* 
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleChange({ target: { name: "language", value } })}
                         onClick={() => toggleLanguage()}
                      >
                           
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en" >English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ar" >Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                    {/* in the future we can add more preferences here */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="USD">
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                          <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                          <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSubmit}>   {t("SaveChanges")||"Save Changes"}</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle> {t("security")|| "Security"}</CardTitle>
                  <CardDescription>
                 {t("Manageyouraccountsecurityprivacy")|| "Manage your account security and privacy settings."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium"> {t("ChangePassword")|| "Change Password"}</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-email">{t("CurrentEmail")|| "Current Email"}</Label>
                          <Input
                            id="current-email"
                            type="email"
                            value={currentEmail}
                            onChange={(e) => {
                              setCurrentEmail(e.target.value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">{t("NewPassword")|| "New Password"}</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                        {t("ConfirmPassword")|| "Confirm New Password"}
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            updatePassword();
                          }}
                        >
                           {t("UpdatePassword")|| "Update Password"}
                     
                        </Button>
                      </div>
                    </div>

                    {/* <div className="space-y-2 pt-4">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div> */}

                    <div className="space-y-2 pt-4">
                      <h3 className="font-medium"> {t("DeleteAccount")|| "Delete Account"}  </h3>
                      <p className="text-sm text-muted-foreground">
                              {t("Permanentlydeleteyouraccoun")|| "Permanently delete your account and all your data."}
                
                      </p>
                      <Button variant="destructive">{t("DeleteAccount")|| "Delete Account"}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>{t("addItem")|| "Add Item"}</CardTitle>
                  <CardDescription>{t("Addyouritemstoswap")|| "Add your items to swap"} </CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemListingForm />
                </CardContent>
              </Card>
            </TabsContent>

            {/* in the future we can add more tabs here */}
            {/* <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods for transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Add Payment Method</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Add a payment method to use for transactions and escrow services.
                      </p>
                      <Button className="mt-4">Add Payment Method</Button>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Escrow Settings</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Configure your escrow settings for secure transactions.
                      </p>
                      <Button variant="outline" className="mt-4">
                        Configure Escrow
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

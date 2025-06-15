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

  // ...existing code...

  // const updatePassword = async () => {
  //   if (!currentPassword || !newPassword || !confirmPassword) {
  //     toast({
  //       title: t("faileChangePassword") || "Failed Change Password",
  //       description: "Please fill in all password fields.",
  //       variant: "destructive",
  //     })
  //     return;
  //   }
  //   if (newPassword !== confirmPassword) {
  //     toast({
  //       title: t("notMach") || "Failed Change Password",
  //       description: "New passwords do not match.",
  //       variant: "destructive",
  //     })
  //     return;
  //   }
  //   try {
  //     const token = await getCookie();
  //     if (!token) {
  //       toast({
  //         title: t("notAuth") || "Failed Change Password",
  //         description: "Not authenticated.",
  //         variant: "destructive",
  //       })
  //       return;
  //     }
  //     const { id } = await decodedToken(token);

  //     // Fetch user to get hashed password
  //     const userData = await getUserById(id);
  //     const hashedPassword = userData.password;
  //     console.log("hashedPassword" , hashedPassword)

  //     // Compare current password with hashed password
  //     const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
  //     console.log("isMatch" , isMatch)

  //     if (!isMatch) {
  //       toast({
  //         title: t("wrongPassword") || "Failed Change Password",
  //         description: "Current password is incorrect.",
  //         variant: "destructive",
  //       })
  //       return;
  //     }

  //     if(hashedPassword == currentPassword){
  //       console.log("okeokeokeokeokeoke ")
  //     }
  //     // Hash the new password
  //     const newHashedPassword = await bcrypt.hash(newPassword, 10);
  //     console.log("newHashedPassword" , newHashedPassword)

  //     // Update password in your backend (you need to implement this API)
  //     await editeProfile({ password: newHashedPassword }, id);

  //     toast({
  //       title: t("successChangePassword") || "Password Changed",
  //       description: "Your password has been updated successfully.",
  //       variant: "success",
  //     })
  //     setCurrentPassword('');
  //     setNewPassword('');
  //     setConfirmPassword('');
  //   } catch (error) {
  //     alert("Error updating password.");
  //   }
  // };

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: t("faileChangePassword") || "Failed Change Password",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
    } else if (newPassword !== confirmPassword) {
      toast({
        title: t("notMach") || "Failed Change Password",
        description: "New passwords do not match.",
        variant: "destructive",
      });
    } else if (newPassword === confirmPassword) {
      try {
        const Password = await resetPassword(newPassword, currentEmail);
        if (Password) {
          toast({
            title: t("successChangePassword") || "Password Changed",
            description: "Your password has been updated successfully.",
            variant: "success",
          });
          setCurrentEmail("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        toast({
          title: t("faildChangePassword") || "Password Error",
          description: "Error updating password..",
          variant: "success",
        });
      }
    } else {
      toast({
        title: t("faildChangePassword") || "Password Error",
        description: "SomeThing Error When updating password..",
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
      .min(8, "Phone number is too short")
      .max(20, "Phone number is too long")
      .regex(/^\+?\d{8,20}$/, "Invalid phone number"),
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
        title: "Wornning",
        description: "No Change To saved",
        variant: "destructive",
      });
    } else {
      if (!result.success) {
        toast({
          title: "Wornning",
          description: "Phone number not validate",
          variant: "destructive", // Assuming your toast supports variants like 'success', 'error', etc.
        });
      } else {
        await editeProfile(userCollectionData, user.id, avatar);
        router.refresh();

        toast({
          title: t("successfully"),
          description: "Settings saved successfully!", // Assuming your toast supports variants like 'success', 'error', etc.
        });
      }
    }
  };

  
  // map

  const getCurrentPosition = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
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
          title: "Current location found",
          description: `Lat: ${pos.lat.toFixed(6)}, Lng: ${pos.lng.toFixed(6)}`,
        });
      },
      (error) => {
        let message = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        toast({
          title: "Location Error",
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
      <div className="mb-6 flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/profile">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>

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
                Profile
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
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="w-full justify-start text-left"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>

              <TabsTrigger
                value="add"
                className="w-full justify-start text-left"
              >
                <CirclePlus className="mr-2 h-4 w-4" />
                Add Item
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
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and how others see you on
                    the platform.
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
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={last_name}
                            onChange={(e) => setLasttName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="street">Street</Label>
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
                              Current Position
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
                                  Getting Location...
                                </>
                              ) : (
                                <>
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Get Current Location
                                </>
                              )}
                            </Button>
                          </CardContent>

                          {selectedPosition && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5" />
                                  Selected Position
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <strong>Name:</strong>{" "}
                                    {selectedPosition.name}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Latitude:</strong>{" "}
                                    {selectedPosition.lat.toFixed(6)}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Longitude:</strong>{" "}
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
                          <Label htmlFor="post_code">Pstal Code</Label>
                          <Input
                            id="post_code"
                            name="post_code"
                            value={post_code}
                            onChange={(e) => setPostCode(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
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
                          <Label htmlFor="phone_number">Phone Number</Label>
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
                          <Label htmlFor="avatar">Avatar</Label>
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
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={gender}
                          // onValueChange={(value) => handleChange({ target: { status: "gender", value } })}
                          onValueChange={(value) => setGender(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
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
                    Save Changes
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
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-muted-foreground">
                          Use dark theme for the application.
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
                  <Button onClick={handleSubmit}>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security and privacy settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-email">Current Email</Label>
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
                          <Label htmlFor="new-password">New Password</Label>
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
                            Confirm New Password
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
                          Update Password
                        </Button>
                      </div>
                    </div>

                    {/* <div className="space-y-2 pt-4">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div> */}

                    <div className="space-y-2 pt-4">
                      <h3 className="font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all your data.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add Item</CardTitle>
                  <CardDescription>Add your items to swap</CardDescription>
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

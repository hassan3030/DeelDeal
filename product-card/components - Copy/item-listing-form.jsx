"use client";

import { useEffect, useState , useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Upload, Info, Loader2, Navigation, MapPin } from "lucide-react";
import Image from "next/image";
import { itemsStatus, categoriesName, allowedCategories } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/lib/use-translations";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addProduct } from "@/callAPI/products";


export function ItemListingForm() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPriceEstimation, setAiPriceEstimation] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [geo_location, set_geo_location] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const mapInstanceRef = useRef(null);
  const { toast } = useToast();
  const { t } = useTranslations();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_IMAGES = 3;

const formSchema = z.object({
  name: z
    .string()
    .min(3, t("Namemustbeatleast3characters")||"Name must be at least 3 characters")
    .max(100, t("Namemustbelessthan100characters")||"Name must be less than 100 characters"),
  description: z
    .string()
    .min(20,t("Descriptiomustbeatleast20characters")|| "Description must be at least 20 characters")
    .max(2000, t("Descriptionmustbelessthan2000characters")||"Descriptionmustbelessthan2000characters"),
  category: z.enum(categoriesName),
  condition: z.string(),
  valueEstimate: z.coerce.number().positive(t("Valuemustbegreaterthan0")||"Value must be greater than 0"),
  allowedCategories: z
    .array(z.enum(allowedCategories))
    .min(1, t("Selectatleastonecategory")||"Select at least one category"),
  // Images will be handled separately
});

  const form = useForm({
    // to check zod validation
    resolver: zodResolver(formSchema),
    // to set default values that will be used in the form by name
    defaultValues: {
     
      name: "",
      description: "",
      category: "",
      status_item: "excellent",
      valueEstimate: 0,
      allowed_categories: [], // Use an array, not a string
      status_swap: "available",
      price: 0,
      city: "",
      country: "",
      street: "",
      user_id: "",
    },
  });

  console.log("form", form.getValues().name);

  const handleImageUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);

    // Validate file size and type
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: t("error") || "ERROR ",
          description: `${t("File")} ${file.name} ${t("istoolargeMaximumsizeis5MB")||"is too large. Maximum size is 5MB."}`,
          variant: "destructive",
        });

        return false;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: t("error") || "ERROR ",
          description: `${t("File")} ${file.name}  ${t("hasanunsupportedformatPleaseuploadJPEGPNGorWebP")||"has an unsupported format. Please upload JPEG, PNG, or WebP."}`,
          variant: "destructive",
        });

        return false;
      }
      return true;
    });

    // Check if adding these files would exceed the maximum
    if (images.length + validFiles.length > MAX_IMAGES) {
      toast({
        title: t("error") || "ERROR ",
        description: `${t('Youcanuploadmaximumof')|| "You can upload a maximum of"}You can upload a maximum of ${MAX_IMAGES} ${t('images')|| "images"}.`,
        variant: "destructive",
      });
      return;
    }

    // Create URLs for preview
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...validFiles]);
    setImageUrls((prev) => [...prev, ...newImageUrls]);
  };

  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const requestAiPriceEstimate = async () => {
    const { name, description, category, condition } = form.getValues();

    // Validate that we have enough information for an estimate
    if (!name || !description || !category || !condition) {
      toast({
        title: t("error") || "ERROR ",
        description:t("PleasedescriptioncategoryconditionAIpriceestimate")||"Please fill in the item name, description, category, and condition for an AI price estimate.",
        variant: "destructive",
      });

      return;
    }

    setIsEstimating(true);

    try {
      // In a real app, this would be an API call to your AI service
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate an AI-generated price based on the item details
      // In a real app, this would come from your AI service
      const mockEstimate = Math.floor(Math.random() * 1000) + 100;

      setAiPriceEstimation(mockEstimate);
      form.setValue("valueEstimate", mockEstimate);
    } catch (error) {
      console.error("Error getting AI price estimate:", error);
      toast({
        title: t("error") || "ERROR ",
        description:t("FailedtogetAIpriceestimatePleasetryagainorenteryourownestimate")||"Failed to get AI price estimate. Please try again or enter your own estimate.",          
        variant: "destructive",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast({
        title: t("error") || "ERROR ",
        description:t("Pleaseuploaleastimageyouritem")||"Please upload at least one image of your item.",          

      
        variant: "destructive",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await handleSubmit();
      console.log("Form data:", data);
      console.log("Images:", images);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to the marketplace or the new item page
      router.push("/");
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: t("error") || "ERROR ",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentPosition = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: t("geolocationNotSupported")||"Geolocation is not supported by this browser",
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
          title: t("CurrentLocationFound")||"Current location found",
          description: `${t("Latitude")}: ${pos.lat.toFixed(6)}, ${t("Longitude")}: ${pos.lng.toFixed(6)}`,
        });
      },



      (error) => {
        let message =t("Unabletoretrieveyourlocation")|| "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = t("Locationaccessdeniedbyuser")||"Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message =t("Locationinformationisunavailable")|| "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message =t("Locationinformationisunavailable")|| "Location request timed out";
            break;
        }
        toast({
          title: t("LocationError")||"Location Error",
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
  
  // const handleSubmit = async () => {
  //   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhZjc2NjE5LTI3ZDgtNDBlOC05ODQ0LWIzYzZjOWExNjlmNSIsInJvbGUiOm51bGwsImFwcF9hY2Nlc3MiOmZhbHNlLCJhZG1pbl9hY2Nlc3MiOmZhbHNlLCJpYXQiOjE3NDk3ODE2NTQsImV4cCI6MTc1MDM4NjQ1NCwiaXNzIjoiZGlyZWN0dXMifQ.gIGdvRMACpw9J6PS2IFEGCP9bqZyLz-Uo3fxljK9-5s"; // Replace with your actual token
  //   const apiBase = "http://localhost:8055";
  //  const {id} = await decodedToken()
  //   const files = images; // Use the images array for file uploads

  //   if (files.length === 0) {

  //      toast({
  //         title: t("error") || "ERROR ",
  //         description:"Please fill all fields and select at least one image.",
  //         variant: "destructive",
  //       })
  //     return;
  //   }

  //   try {
  //     // 1. Create the item (without images yet)
  //     const payload = { ...form.getValues() };
  //      // Ensure the id field is not included
  //     console.log("Payload:", payload);

  //     const itemRes = await fetch(`http://localhost:8055/items/Items`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     body: JSON.stringify({...payload , user_id:id}) ,
  //     });

  //     const itemData = await itemRes.json();
  //     console.log("Response:", itemData);

  //     if (!itemRes.ok) {
  //       throw new Error(itemData.errors || "Failed to create item");
  //     }

  //     const itemId = itemData?.data?.id;
  //     if (!itemId) {
  //       throw new Error("Failed to retrieve item ID from the response.");
  //     }

  //     // 2. Upload each image and link to item
  //     for (const file of files) {
  //       const formData = new FormData();
  //       formData.append("file", file);

  //       // Upload file to /files
  //       const fileRes = await fetch(`${apiBase}/files`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       });

  //       const fileData = await fileRes.json();
  //       console.log("File Response:", fileData);

  //       if (!fileRes.ok) {
  //         throw new Error(fileData.errors || "Failed to upload file");
  //       }

  //       const fileId = fileData?.data?.id;
  //       if (!fileId) {
  //         throw new Error("Failed to retrieve file ID from the response.");
  //       }

  //       // Link the uploaded image to the item
  //       await fetch(`${apiBase}/items/Items_files`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           Items_id: itemId,
  //           directus_files_id: fileId,
  //         }),
  //       });
  //     }

  //   toast({
  //           title: t("successfully") ,
  //           description:  "Item added successfully with images!",
  //         })
  //          // Clear all fields and images
  //   form.reset();
  //   setImages([]);
  //   setImageUrls([]);
  //   router.refresh()

  //   } catch (err) {
  //     console.error(err);

  //      toast({
  //         title: t("error") || "ERROR ",
  //         description:err.message || "Error adding item.",
  //         variant: "destructive",
  //       })

  //   }
  // };
  const handleSubmit = async () => {
    const files = images;
    if (files.length === 0) {
      toast({
        title: t("error") || "ERROR ",
        description: t("Pleaseuploaleastimageyouritem")||"Please upload at least one image of your item.",  
        variant: "destructive",
      });
      return;
    }

    // -------------------------------------
    try {
      // 1. Create the item (without images yet)
      const payload = { ...form.getValues() , geo_location};
      console.log("Payload:", payload);
      console.log("geo_location:", geo_location);

      await addProduct(payload, files);

      toast({
        title: t("successfully"),
        description: t("Itemaddedsuccessfullywithimage")||"Item added successfully with images!",
      });
      // Clear all fields and images
      form.reset();
      setImages([]);
      setImageUrls([]);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast({
        title: t("error") || "ERROR ",
        description: err.message ||  t("Erroraddingitem")||"Error adding item.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={() => {
          form.handleSubmit(onSubmit);
        }}
        className="space-y-8"
      >
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left column - Basic details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t("ItemDetails")||"Item Details"}</h2>
              <p className="text-sm text-muted-foreground">
                {t("Providedetailedinformationunderstandoffering")||"Provide detailed information about your item to help others  understand what you're offering."}
            
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                onClick={() => {
                  handleSubmit();
                }}
              >
                {t("CreateListing")||"Creating new product"}
             
              </Button>
              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ItemName")||"Item Name"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., MacBook Pro 16-inch 2021"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("Bespecificaboutbrandmodelkeyfeatures")||"Be specific about brand, model, and key features."}
                 
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* location */}
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
                                 {t("GettingLocation")||"Getting Location..."}
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
                                  {t("SelectedPosition")||"  Selected Position"}
                              
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <strong>  {t("Name")||"Name"}:</strong>{" "}
                                    {selectedPosition.name}
                                  </p>
                                  <p className="text-sm">
                                    <strong>  {t("Latitude")||"Latitude"}:</strong>{" "}
                                    {selectedPosition.lat.toFixed(6)}
                                  </p>
                                  <p className="text-sm">
                                    <strong>  {t("Longitude")||"Longitude"}:</strong>{" "}
                                    {selectedPosition.lng.toFixed(6)}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Card>


              {/* price  */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> {t("price")||"Price"}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., San Francisco, CA"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> {t("Country")||"Country"}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Egypt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* city */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> {t("City")||"City"}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("e.g., Sohage")||"e.g., Sohage"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* street  */}
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Street")||"Street"}</FormLabel>
                    <FormControl>
                      <Input placeholder= {t("egOmarebnElkhtab")||"e.g., Omar ebn Elkhtab"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")||"Description"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=  {t("Describeyouritemndetailincludingconditionfeaturesandanyrelevanthistory")||"Describe your item in detail, including condition, features, and any relevant history."}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                   {t("detailsprovidethemorelikelyfindgoodswap")||"The more details you provide, the more likely you are to find a good swap."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                   {t("category")||"Category"}
                      
                      </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Selectacategory")||"Select a category"}  />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesName.map((category) => (
                          <SelectItem key={category} value={category}>
                           {t(category)|| category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Condition")||"Condition"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder= {t("SelectCondition")||"Select condition" }/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {itemsStatus.map((condition) => (
                          <SelectItem
                            key={condition}
                            value={condition}
                            className="capitalize"
                          >
                         {t(condition)||condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right column - Images and value */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t("ImagesValue")||"Images & Value"}</h2>
              <p className="text-sm text-muted-foreground">
                         {t("Uploadclearphotosofyouritemandsetitsestimatedvalue")||"Upload clear photos of your item and set its estimated value"}
              </p>
            </div>

            <div>
              <FormLabel>{t("ItemImages")||"Item Images"}</FormLabel>
              <div className="mt-2 grid grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Item image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Card>
                ))}

                {images.length < MAX_IMAGES && (
                  <Card className="flex aspect-square items-center justify-center">
                    <CardContent className="flex h-full w-full flex-col items-center justify-center p-4">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-center"
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t("Clicktoupload")||"Click to upload"}
                        </p>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </CardContent>
                  </Card>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                    {t("Uploadupto")||"Upload up to"} {MAX_IMAGES}   {t("images")||"images"} (JPEG, PNG, WebP, max 5MB each)
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="valueEstimate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel> {t("aIExpectedPrice")||"Estimated Value"} ($)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={requestAiPriceEstimate}
                              disabled={isEstimating}
                              className="h-8 gap-1"
                            >
                              {isEstimating ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Estimating...
                                  {t("Estimating")||"Estimating..."} 
                                </>
                              ) : (
                                <>
                                  <Info className="h-3 w-3" />
                                  {t("GetAIEstimate")||"Get AI Estimate"} 
                                  
                                 
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                                {t("GetAIpoweredpriceestimatebasedonyouritemdetails")||"Get an AI-powered price estimate based on your item details"} 
                             
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    {aiPriceEstimation !== null && (
                      <p className="text-xs text-[#49c5b6]">
                                  {t("AIsuggestsvalueof")||" AI suggests a value of"} ${aiPriceEstimation}
                      </p>
                    )}
                    <FormDescription>
                                  {t("Setfairmarketvaluetohelpfacilitatebalancedswaps")||"   Set a fair market value to help facilitate balanced swaps."} 

                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            {/* start */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="allowed_categories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                           {t("Whatwillyouacceptinreturn")||"What will you accept in return?"}
                    
                      </FormLabel>
                      <FormDescription>
                           {t("Selectthecategoriesofitemsyourewillingtoacceptinexchange")||"What will you accept in return?"}

                     
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {allowedCategories.map((category) => {
                        const isAll = category === "all";
                        const selected =
                          form.getValues("allowed_categories") || [];
                        const isAllSelected = selected.includes("all");

                        return (
                          <FormField
                            key={category}
                            control={form.control}
                            name="allowed_categories"
                            render={({ field }) => (
                              <FormItem
                                key={category}
                                className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    disabled={!isAll && isAllSelected}
                                    onCheckedChange={(checked) => {
                                      if (isAll) {
                                        // Toggle "all" on/off
                                        field.onChange(checked ? ["all"] : []);
                                      } else {
                                        // Toggle other categories, but remove "all" if present
                                        let newValue =
                                          field.value?.filter(
                                            (v) => v !== "all"
                                          ) || [];
                                        if (checked) {
                                          newValue = [...newValue, category];
                                        } else {
                                          newValue = newValue.filter(
                                            (v) => v !== category
                                          );
                                        }
                                        field.onChange(newValue);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal capitalize px-1">
                                  {t(category)||category}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* the end */}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/profile")}
          >
             {t('Cancel')||"Cancel"}
            
          </Button>
          <Button
            type="submit"
            className="bg-[#49c5b6] hover:bg-[#3db6a7]"
            disabled={isSubmitting}
            onClick={() => {
              handleSubmit();
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />.
                {

                t('CreateListing')||"Create Listing...."
                }
              </>
            ) : (
            <>
             {

                t('CreateListing')||"Create Listing"
              }
            </>
             
                
             
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

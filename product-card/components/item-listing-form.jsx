
"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Upload, Info, Loader2 } from "lucide-react"
import Image from "next/image"
import {itemsStatus , categoriesName ,allowedCategories} from "@/lib/data"


import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Category } from "@/components/item-card"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_IMAGES = 3

// const categories = [
//   "Electronics",
//   "RealEstate",
//   "Vehicles",
//   "Furniture",
//   "Fashion",
//   "Clothing",
//   "Collectibles",
//   "Sports",
//   "Books & Stationery",
//   "Software",
//   "Jewelry & Accessories",
//   "Automotive & Tools",
//   "Electronics & Gadgets",
//   "Home & Kitchen",
//   "Beauty & Personal Care",
//   "Toys & Kids",
//   "Health & Wellness",
//   "All",
// ]



// const itemsStatus = [
//   { value: "new", label: "New" },
//   { value: "like_new", label: "Like New" },
//   { value: "excellent", label: "Excellent" },
//   { value: "good", label: "Good" },
//   { value: "fair", label: "Fair" },
// ]

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters"),
  category: z.enum(categoriesName),
  condition: z.string(),
  valueEstimate: z.coerce.number().positive("Value must be greater than 0"),
  allowedCategories: z.array(z.enum(allowedCategories)).min(1, "Select at least one category"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  // Images will be handled separately
})

//  FormValues = z.infer<typeof formSchema>

export function ItemListingForm() {

  const router = useRouter()
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiPriceEstimation, setAiPriceEstimation] = useState(null)
  const [isEstimating, setIsEstimating] = useState(false)

  const form = useForm({
    // to check zod validation
    resolver: zodResolver(formSchema),
    // to set default values that will be used in the form by name
    defaultValues: {
      
      // allowed_categories: ["All"],
      // location:{cairo: "Cairo", alex: "Alexandria"},
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
 user_id: "aaf76619-27d8-40e8-9844-b3c6c9a169f5",
    },
  })

  console.log("form", form.getValues().name)

  const handleImageUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)

    // Validate file size and type
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`)
        return false
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`File ${file.name} has an unsupported format. Please upload JPEG, PNG, or WebP.`)
        return false
      }
      return true
    })

    // Check if adding these files would exceed the maximum
    if (images.length + validFiles.length > MAX_IMAGES) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`)
      return
    }

    // Create URLs for preview
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file))

    setImages((prev) => [...prev, ...validFiles])
    setImageUrls((prev) => [...prev, ...newImageUrls])
  }

  const removeImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const requestAiPriceEstimate = async () => {
    const { name, description, category, condition } = form.getValues()

    // Validate that we have enough information for an estimate
    if (!name || !description || !category || !condition) {
      alert("Please fill in the item name, description, category, and condition for an AI price estimate.")
      return
    }

    setIsEstimating(true)

    try {
      // In a real app, this would be an API call to your AI service
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate an AI-generated price based on the item details
      // In a real app, this would come from your AI service
      const mockEstimate = Math.floor(Math.random() * 1000) + 100

      setAiPriceEstimation(mockEstimate)
      form.setValue("valueEstimate", mockEstimate)
    } catch (error) {
      console.error("Error getting AI price estimate:", error)
      alert("Failed to get AI price estimate. Please try again or enter your own estimate.")
    } finally {
      setIsEstimating(false)
    }
  }

  const onSubmit = async (data) => {
    if (images.length === 0) {
      alert("Please upload at least one image of your item.")
      return
    }

    setIsSubmitting(true)

    try {
    await  handleSubmit()
      // In a real app, you would:
      // 1. Upload the images to a storage service
      // 2. Get the URLs of the uploaded images
      // 3. Create the item in your database with the image URLs

      console.log("Form data:", data)
      console.log("Images:", images)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to the marketplace or the new item page
      router.push("/")
    } catch (error) {
      console.error("Error creating item:", error)
      alert("Failed to create item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

//   const handleSubmit = async () => {
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0NzE5NTUzNywiZXhwIjoxNzQ3ODAwMzM3LCJpc3MiOiJkaXJlY3R1cyJ9.hGBZxv27U-zgHFTDPMPlaMdVGr9FesUmLjZLyFpr7PE"; // 🔒 أدخل التوكن الخاص بك هنا
// const apiBase = "http://localhost:8055";
// // Items_files

//   const files = images; // Use the images array for file uploads

//   if (files.length === 0) {
//     alert("Please fill all fields and select at least one image.");
//     return;
//   }

//   try {
//     // 1. Create the item (without images yet)
//     const itemRes = await fetch(`${apiBase}/items/Items`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(form.getValues()), 
//     });

//     const itemData = await itemRes.json();
//     console.log(itemData)
//     const itemId = itemData.data.id;

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
//       const fileId = fileData?.data?.id;

//     //   // Link the uploaded image to the item through items_images (M2M or relational table)
//     //   await fetch(`${apiBase}/items/Items_files`, {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //     body: JSON.stringify({
//     //       Items_id: itemId,
//     //       directus_files_id: fileId,
//     //     }),
//     //   });
//      // 2. Link to item (via items_images)
//     // await fetch("http://localhost:8055/items/items_images", {
//     await fetch("http://localhost:8055/items/Items_files    ", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         Items_id: itemId,
//       directus_files_id: fileId,
//       }),
//     });
//     }

//     alert("Item added successfully with images!");
//   } catch (err) {
//     console.error(err);
//     alert("Error adding item.");
//   }
// }
const handleSubmit = async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJmZWZiYzU2LTU3NGItNGE4My04NjlmLTE5NDBmMWFhMTY4NyIsInJvbGUiOiIzOGM4YTAwMy02MmEwLTQzYjItYWZmZS1mZjI1NDJkNGRjY2MiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc0ODQ0MzA5NSwiZXhwIjoxNzQ5MDQ3ODk1LCJpc3MiOiJkaXJlY3R1cyJ9.oY-hUrj2AFzULfOD9GzKqaAFDqF8vOVLpo4kaPjTR-A"; // Replace with your actual token
  const apiBase = "http://localhost:8055";

  const files = images; // Use the images array for file uploads

  if (files.length === 0) {
    alert("Please fill all fields and select at least one image.");
    return;
  }

  try {
    // 1. Create the item (without images yet)
    const payload = { ...form.getValues() };
     // Ensure the id field is not included
    console.log("Payload:", payload);

    const itemRes = await fetch(`http://localhost:8055/items/Items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const itemData = await itemRes.json();
    console.log("Response:", itemData);

    if (!itemRes.ok) {
      throw new Error(itemData.errors || "Failed to create item");
    }

    const itemId = itemData?.data?.id;
    if (!itemId) {
      throw new Error("Failed to retrieve item ID from the response.");
    }

    // 2. Upload each image and link to item
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to /files
      const fileRes = await fetch(`${apiBase}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const fileData = await fileRes.json();
      console.log("File Response:", fileData);

      if (!fileRes.ok) {
        throw new Error(fileData.errors || "Failed to upload file");
      }

      const fileId = fileData?.data?.id;
      if (!fileId) {
        throw new Error("Failed to retrieve file ID from the response.");
      }

      // Link the uploaded image to the item
      await fetch(`${apiBase}/items/Items_files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Items_id: itemId,
          directus_files_id: fileId,
        }),
      });
    }

    alert("Item added successfully with images!");
  } catch (err) {
    console.error(err);
    alert(err.message || "Error adding item.");
  }
};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left column - Basic details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Item Details</h2>
              <p className="text-sm text-muted-foreground">
                Provide detailed information about your item to help others understand what you're offering.
              </p>
            </div>
  <div className="grid gap-4 sm:grid-cols-2">
    <Button onClick={()=>{  handleSubmit()}}>Creating Listing</Button>
{/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MacBook Pro 16-inch 2021" {...field} />
                  </FormControl>
                  <FormDescription>Be specific about brand, model, and key features.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

{/* location */}
            {/* <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormDescription>This helps match you with nearby swappers.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* price  */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field}  type='number' />
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
                  <FormLabel>Country</FormLabel>
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sohage" {...field} />
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
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Omar ebn Elkhtab" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail, including condition, features, and any relevant history."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more details you provide, the more likely you are to find a good swap.
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesName.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {itemsStatus.map((condition) => (
                          <SelectItem key={condition} value={condition} className="capitalize">
                            {condition}
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
              <h2 className="text-xl font-semibold">Images & Value</h2>
              <p className="text-sm text-muted-foreground">
                Upload clear photos of your item and set its estimated value.
              </p>
            </div>

            <div>
              <FormLabel>Item Images</FormLabel>
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
                      <label htmlFor="image-upload" className="cursor-pointer text-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">Click to upload</p>
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
                Upload up to {MAX_IMAGES} images (JPEG, PNG, WebP, max 5MB each)
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="valueEstimate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Estimated Value ($)</FormLabel>
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
                                </>
                              ) : (
                                <>
                                  <Info className="h-3 w-3" />
                                  Get AI Estimate
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Get an AI-powered price estimate based on your item details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    {aiPriceEstimation !== null && (
                      <p className="text-xs text-[#49c5b6]">AI suggests a value of ${aiPriceEstimation}</p>
                    )}
                    <FormDescription>Set a fair market value to help facilitate balanced swaps.</FormDescription>
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
          <FormLabel className="text-base">What will you accept in return?</FormLabel>
          <FormDescription>
            Select the categories of items you're willing to accept in exchange.
          </FormDescription>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allowedCategories.map((category) => {
            const isAll = category === "all";
            const selected = form.getValues("allowed_categories") || [];
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
                            let newValue = field.value?.filter((v) => v !== "all") || [];
                            if (checked) {
                              newValue = [...newValue, category];
                            } else {
                              newValue = newValue.filter((v) => v !== category);
                            }
                            field.onChange(newValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal capitalize">{category}</FormLabel>
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
          <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#49c5b6] hover:bg-[#3db6a7]" disabled={isSubmitting}
          onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              "Create Listing"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

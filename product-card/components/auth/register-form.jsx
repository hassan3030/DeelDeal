"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
// import { useAuth } from "@/lib/auth-context"
import { useTranslations } from "@/lib/use-translations";
  


import { register } from "@/callAPI/users"
import { decodedToken, getCookie } from "@/callAPI/utiles"




export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  // const { register } = useAuth()
  const { t } = useTranslations()
  const formSchema = z
  .object({
    userName: z.string().min(2,t( "Namemustbeatleast2characters")|| "Name must be at least 2 characters").max(50, t("Namemustbelessthan50characters")|| "Name must be less than 50 characters"),
    email: z.string().email(t("Pleaseenteravalidemailaddress")||"Please enter a valid email address"),
    password: z
      .string()
      .min(8, t("Passwordmustbeatleast8characters")|| "Password must be at least 8 characters")
      .regex(/[A-Z]/, t("Passwordmustcontainatleastoneuppercaseletter")||  "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, t("Passwordmustcontainatleastonelowercaseletter")|| "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, t("Passwordmustcontainatleastonenumber")|| "Password must contain at least one number"),
    confirmPassword: z.string(),
    // location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message:t("Passwordsdonotmatch")||"Passwords do not match" ,
    path: ["confirmPassword"],
  })
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      // location: "",
    },
  })

  

  const onSubmit = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your auth service
     const response = await register(form.getValues().email, form.getValues().password, form.getValues().userName);
      // console.log(form.getValues().email, form.getValues().password, form.getValues().userName) ;
      // console.log( form.getValues().password) ;
      // console.log( form.getValues().userName) ;
      if (!response) {
        const Token = await getCookie('Token')
        const {id} = await decodedToken(Token);
        toast({

        title: t("successfully")||"Successfully",
        description: t("YouraccounthasbeencreatedWelcometoDeelDeal")||"Your account has been created. Welcome to DeelDeal!",
      })
        console.log("id" , id)
        router.push(`/profile/settings/editItem/new`)
        // router.push(`/profile/${id}`)
      } 
      else {
       toast({
          title:t("error")||"ERROR",
        description: t("TherewasaproblemcreatingyouraccountPleasetryagain")||"There was a problem creating your account. Please try again.",
        variant: "destructive",
      })
      }


      
      // Redirect to the marketplace
      // router.push("/")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title:t("error")||"ERROR",
        description: t("TherewasaproblemcreatingyouraccountPleasetryagain")||"There was a problem creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>

              <FormLabel>{t("FullName")||"Full Name"}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel> {t("email")||"Email"} </FormLabel>
              <FormControl>

                <Input type="email" placeholder= "you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              
              <FormLabel>{t("password")||"Password"}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? t("Hidepassword")||"Hide password"  : t("Showpassword")||"Show password"}</span>
                  </Button>   
                </div>
              </FormControl>
              <FormDescription>
                {t("Passwordmustbeatleast8charactersandincludeuppercaselowercaseandnumbers")||"Password must be at least 8 characters and include uppercase, lowercase, and numbers."}
               
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ConfirmPassword")||"Confirm Password" }</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ?t("Hidepassword")||"Hide password"  : t("Showpassword")||"Show password"}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, State/Province, Country" {...field} />
              </FormControl>
              <FormDescription>This helps match you with nearby swappers.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-[#49c5b6] hover:bg-[#3db6a7]"  onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            { t("CreatingAccount")||"Creating Account..."}
             
              </>
            ) : (
              t("CreatingAccount")||"Creating Account..."
            )}
          </Button>

          <div className="text-center text-sm">
              { t("Alreadyhaveanaccount")||"Already have an account?"}{" "}
            <Link href="/auth/login" className="font-medium text-[#49c5b6] hover:underline">
               { t("Signin")||"Sign in"}
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}

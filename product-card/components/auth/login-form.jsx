"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import { FaGoogle, FaFacebook } from "react-icons/fa"

import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
// import { useAuth } from "@/lib/auth-context"

import { useTranslations } from "@/lib/use-translations"
import { useLanguage } from "@/lib/language-provider"
import { authAPI } from "@/callAPI"
import { cn } from "@/lib/utils"
import { login } from "@/callAPI/users"
// import environment from "@/config/environment"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
  })
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  // const { login, loginWithSocial } = useAuth()
  const { t } = useTranslations()
  const { isRTL } = useLanguage()

  // Get the return URL from the query parameters or default to the homepage
  const returnUrl = searchParams.get("returnUrl") || "/"

  // Use basic react-hook-form without zod to avoid potential compatibility issues
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  })

// const handleLogin = async () => {
//       try {
       
//         } 
//         else {
//           toast.error("Login failed")
//         }
//       } catch (error) {
//         console.error("Error during Login:", error);
//         toast.error("Login failed " + error.message)  
//       }
//     }

  // Initialize social login SDKs
  useEffect(() => {
    // Load Google SDK
    // if (environment.enableSocialLogin && environment.googleClientId) {
    //   const loadGoogleScript = () => {
    //     const script = document.createElement("script")
    //     script.src = "https://accounts.google.com/gsi/client"
    //     script.async = true
    //     script.defer = true
    //     document.body.appendChild(script)
    //     return () => {
    //       document.body.removeChild(script)
    //     }
    //   }

    //   // Load Facebook SDK
    //   const loadFacebookScript = () => {
    //     const script = document.createElement("script")
    //     script.src = "https://connect.facebook.net/en_US/sdk.js"
    //     script.async = true
    //     script.defer = true
    //     document.body.appendChild(script)

    //     window.fbAsyncInit = () => {
    //       window.FB.init({
    //         appId: environment.facebookAppId,
    //         cookie: true,
    //         xfbml: true,
    //         version: "v16.0",
    //       })
    //     }

    //     return () => {
    //       document.body.removeChild(script)
    //     }
    //   }

    //   const googleCleanup = loadGoogleScript()
    //   const facebookCleanup = loadFacebookScript()

    //   return () => {
    //     googleCleanup()
    //     facebookCleanup()
    //   }
    // }
  }, [])

  const validateForm = (data) => {
    let isValid = true
    const newErrors = {
      email: "",
      password: "",
    }

    if (!data.email) {
      newErrors.email = t("emailRequired") || "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = t("invalidEmail") || "Please enter a valid email address"
      isValid = false
    }

    if (!data.password) {
      newErrors.password = t("passwordRequired") || "Password is required"
      isValid = false
    }

    setFormError(newErrors)
    return isValid
  }

  const onSubmit = async (data) => {
    console.log("data on submite in login " , data) ;

    if (!validateForm(data)) return
    setIsLoading(true)

    try {
      // Use the new API method from callAPI folder
 const response = await login(data.email, data.password);
        console.log(response) ;
        if (response) {
           toast({
        title: t("loginSuccessful") || "Login successful!",
        description: t("welcomeBack") || "Welcome back to DeelDeal!",
      })
          router.push("/")
        }
        
        
      // await authAPI.login(data.email, data.password)

      // Redirect to the return URL or homepage
    
    } catch (error) {
      toast({
        title: t("loginFailed") || "Login failed",
        description: t("invalidCredentials") || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
      console.error("Login error:", error)
      
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSocialLoading((prev) => ({ ...prev, google: true }))

    try {
      const response = await authAPI.loginWithGoogle()

      if (response.success) {
        toast({
          title: t("loginSuccessful") || "Login successful!",
          description: t("welcomeWithGoogle") || "Welcome to DeelDeal!",
        })

        router.push(returnUrl)
      } else {
        throw new Error("Google login failed")
      }
    } catch (error) {
      console.error("Google login error:", error)
      toast({
        title: t("loginFailed") || "Login failed",
        description: t("googleLoginFailed") || "Google login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSocialLoading((prev) => ({ ...prev, google: false }))
    }
  }

  const handleFacebookLogin = async () => {
    setSocialLoading((prev) => ({ ...prev, facebook: true }))

    try {
      const response = await authAPI.loginWithFacebook()

      if (response.success) {
        toast({
          title: t("loginSuccessful") || "Login successful!",
          description: t("welcomeWithFacebook") || "Welcome to DeelDeal!",
        })

        router.push(returnUrl)
      } else {
        throw new Error("Facebook login failed")
      }
    } catch (error) {
      console.error("Facebook login error:", error)
      toast({
        title: t("loginFailed") || "Login failed",
        description: t("facebookLoginFailed") || "Facebook login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSocialLoading((prev) => ({ ...prev, facebook: false }))
    }
  }

// const loginWithGoogle = () => {
//   window.location.href = 'http://localhost:8055/auth/login/google';
// };
// <button onClick={loginWithGoogle}>loginWithGoogle</button>

  return (
    <div className="w-full">

 

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("email") || "Email"}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder") || "you@example.com"}
            className={isRTL ? "text-right" : ""}
            {...register("email")}
          />
          {formError.email && <p className="text-sm text-red-500">{formError.email}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              {t("password") || "Password"}
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
              {t("forgotPassword") || "Forgot password?"}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pr-10 ${isRTL ? "text-right" : ""}`}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">
                {showPassword ? t("hidePassword") || "Hide password" : t("showPassword") || "Show password"}
              </span>
            </Button>
          </div>
          {formError.password && <p className="text-sm text-red-500">{formError.password}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <label htmlFor="rememberMe" className="text-sm font-normal">
            {t("rememberMe") || "Remember me for 30 days"}
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className={cn("w-full bg-primary text-primary-foreground hover:bg-primary/90")}
            disabled={isLoading}
            onClick={onSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("signingIn") || "Signing in..."}
              </>
            ) : (
              t("signIn") || "Sign In"
            )}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <span className="relative bg-background px-2 text-xs text-muted-foreground">
              {t("orContinueWith") || "Or continue with"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isLoading || socialLoading.google}
              className="flex items-center gap-2"
              onClick={handleGoogleLogin}
            >
              {socialLoading.google ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FaGoogle className="h-4 w-4 text-red-500" />
              )}
              {t("google") || "Google"}
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading || socialLoading.facebook}
              className="flex items-center gap-2"
              onClick={handleFacebookLogin}
            >
              {socialLoading.facebook ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FaFacebook className="h-4 w-4 text-blue-600" />
              )}
              {t("facebook") || "Facebook"}
            </Button>
          </div>

          <div className="text-center text-sm">
            {t("noAccount") || "Don't have an account?"}{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              {t("signUp") || "Sign up"}
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

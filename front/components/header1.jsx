"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Bell,
  Menu,
  X,
  User,
  Moon,
  Sun,
  Settings,
  LogOut,
  CirclePlus,
  HandPlatter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
// import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-provider";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import { removeCookie, getCookie, decodedToken } from "@/callAPI/utiles";
import {
  getOfferById,
  getOffersNotifications,
  getWishList,
  getMessage,
} from "@/callAPI/swap";

import { categoriesName } from "@/lib/data";
import { getUserById } from "@/callAPI/users";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState();
  const [filter, serFilter] = useState("");
  const [cartLength, setCartLength] = useState(0);
  const [notificationsLength, setNotificationsLength] = useState(0);
  const [wishlistLength, setWishlistLength] = useState(0);
  const [chatLength, setChatLength] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const router = useRouter();
  const { isRTL, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  // Use translations
  const { t } = useTranslations();
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handlegetProductSearchFilter = () => {
    const filterTrim = filter.trim();
    if (filterTrim) {
      router.push(`/filterItems/${filterTrim}`);
    }
  };

  const getUser = async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken(token);
      const userData = await getUserById(id);
      setUser(userData);
    }
  };

  const getWishlist = async () => {
    const { id } = await decodedToken();
    const wishList = await getWishList(id);
    console.log("wishlist", wishList); // Check what is returned
    setWishlistLength(Array.isArray(wishList) ? wishList.length : 0);
  };

  const getChat = async () => {
    const { id } = await decodedToken();
    const chat = await getMessage(id);
    console.log("chat", chat); // Check what is returned
    setChatLength(Array.isArray(chat) ? chat.length : 0);
  };

 const getOffers = async () => {
  const token = await getCookie();
  if (token) {
    const { id } = await decodedToken();
    // Get all offers for the user
    const offers = await getOfferById(id);

    // Filter offers where offer_status is "pending" or "accepted"
    const filteredOffers = Array.isArray(offers)
      ? offers.filter(
          (offer) =>
            offer.status_offer === "pending" || offer.status_offer === "accepted"
        )
      : [];

    

    const notifications = await getOffersNotifications(id);

 const filteredNotifications = Array.isArray(notifications)
      ? notifications.filter(
          (notifications) =>
            notifications.status_offer === "pending" || notifications.status_offer === "accepted"
        )
      : [];
      
      console.log('cartLength' ,cartLength)
      console.log('notifications' ,notificationsLength)
      setCartLength(filteredOffers.length);
    setNotificationsLength( filteredNotifications.length );
  }
};

  const logout = async () => {
    await removeCookie();
    setUser(null);
    // router.refresh();
    window.location.reload();
  };

  useEffect(() => {
    getUser();
    getOffers();
    getWishlist();
    getChat();

    //  router.refresh();
  }, []);

  useEffect(() => {
    if (!hasSearched) return; // Don't redirect on initial mount
    if (filter === "") {
      router.push("/");
    } else if (filter.trim() !== "") {
      handlegetProductSearchFilter();
    }
  }, [filter, hasSearched]);

  // const { data:session } = useSession();

  return (
    <>
      {/* 
    <div>
      {session ? (
        <>
          <p>Welcome, {session.user.name}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      )}
    </div> */}

      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        {/* Top bar - hidden on small and medium screens, visible on large screens */}
        <div className="hidden lg:block bg-primary text-primary-foreground px-4 py-1">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/customerService" className="text-xs hover:underline">
                {t("customerService")}
              </Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Theme and Language toggles for main header - visible only on small and medium screens */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTheme()}
                className="rounded-full hover:bg-primary/10"
                aria-label={theme === "light" ? t("darkMode") : t("lightMode")}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLanguage()}
                className="rounded-full hover:bg-primary/10"
                aria-label={t("language")}
              >
                <span className="text-sm font-medium">
                  {isRTL ? "EN" : "عر"}
                </span>
              </Button>
            </div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:scale-110">
              <div className="flex h-10 w-32 bg-none items-center justify-center rounded-md font-bold text-black dark:text-white  shadow-md">
                {/* DeelDeal */}
                <Image
                  src={"/logo.png"}
                  alt={"Logo"}
                  width={128}
                  height={45}
                  className="rounded-xl"
                />
              </div>
            </Link>

            {/* Search */}
            <div className="relative hidden flex-1 md:block">
              <Search
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
              />
              <Input
                placeholder={t("search")}
                className={`${
                  isRTL ? "pr-12" : "pl-12"
                } rounded-full border-2 border-primary`}
                value={filter}
                onChange={(e) => {
                  serFilter(e.target.value);
                  setHasSearched(true);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handlegetProductSearchFilter();
                    setHasSearched(true);
                  }
                }}
              />
              {filter.trim() && (
                <Button
                  size="xs"
                  className={`absolute top-1/2 -translate-y-1/2 h-full rounded-full ${
                    isRTL ? "right-0 ml-2 " : "left-0 mr-2 "
                  } px-3 py-1`}
                  onClick={() => handlegetProductSearchFilter()}
                  variant="default"
                >
                  <Search />
                </Button>
              )}
            </div>

            {/* Actions */}
            <div className="hidden items-center gap-4 md:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 hover:text-black-"
                    >
                      {user?.avatar ? (
                        <img
                          src={
                            `http://localhost:8055/assets/${user.avatar}` ||
                            "/placeholder.svg"
                          }
                          alt={user?.first_name || t("account")}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>{user?.first_name || t("account")}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.first_name || t("account")}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || ""}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>{t("profile")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/settings/editProfile/`}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>{t("settings")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>

                    <DropdownMenuSeparator />
                    <Link href="/">
                      <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t("logout")}</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-1 text-sm hover:text-primary"
                  >
                    <Link href="/auth/login">{t("signIn")}</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className={cn(
                      "gap-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Link href="/auth/register">{t("signUp")}</Link>
                  </Button>
                </>
              )}

              {user ? (
                <>
                  <Link href="/notifications" className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary"
                    >
                      <Bell className="h-5 w-5" />
                      {notificationsLength ? (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {notificationsLength}
                        </span>
                      ) : null}
                      <span className="sr-only">{t("notifications")}</span>
                    </Button>
                  </Link>

                  <Link href="/cart" className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {cartLength ? (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {cartLength}
                        </span>
                      ) : (
                        ""
                      )}

                      <span className="sr-only">{t("cart") || "Cart "}</span>
                    </Button>
                  </Link>

                  <Link href="/wishList" className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary"
                    >
                      <Heart className="h-5 w-5" />
                      {wishlistLength !== 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {wishlistLength}
                        </span>
                      ) : (
                        ""
                      )}

                      <span className="sr-only">
                        {t("wishlist") || "wishlist"}
                      </span>
                    </Button>
                  </Link>

                  <Link href="/chat" className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary group" // <-- add group here
                    >
                      <MessageCircle className="h-5 w-5" />
                      {chatLength !== 0 ? (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {chatLength}
                        </span>
                      ) : (
                        ""
                      )}
                      <span className="pointer-events-none absolute -top-8 right-0 z-10 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                        {t("messages") || "Messages"}
                      </span>
                    </Button>
                  </Link>

                  {/* add items */}
                  <Link
                    href="/profile/settings/editItem/new"
                    className="relative"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:text-primary group" // <-- add group here
                    >
                      <CirclePlus className="h-8 w-8" />
                      <span className="pointer-events-none absolute -top-8 right-0 z-10 hidden rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                        {t("addanewitem") || "  Add a new item"}
                      </span>
                    </Button>
                  </Link>
                </>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`}
              />
              <Input
                placeholder={t("search")}
                className={`${
                  isRTL ? "pr-10" : "pl-10"
                } rounded-full border-2 border-primary`}
              />
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen &&
            (user ? (
              <div className="mt-4 border-t pt-4 md:hidden">
                <nav className="flex flex-col gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 hover:text-black hover:bg-primary/10"
                      >
                        {/* {user?.avatar ? (
                      <img
                        src={`http://localhost:8055/assets/${user.avatar}` || "/placeholder.svg"}
                        alt={user?.first_name || t("account")}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) 
                    
                    : (
                      <User className="h-4 w-4" />
                    )} */}

                        {
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={user?.avatar}
                              alt={user?.first_name || t("account")}
                            />
                            <AvatarFallback>
                              {user?.first_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        }
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.first_name || t("account")}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuSeparator />

                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>{t("profile")}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/profile/settings/editProfile/`}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t("settings")}</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="my-2 border-t"></div>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <Bell className="h-4 w-4" />
                    <span>
                      {`${t("notifications")} `}
                      {`${notificationsLength ? notificationsLength : ""}`}
                    </span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{`${t("cart")} ${
                      cartLength ? cartLength : ""
                    } `}</span>
                  </Link>

                  <Link
                    href="/chat"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{`${t("messages")||"Messages"}  ${
                      chatLength ? chatLength : ""
                    } `}</span>

                    <span></span>
                  </Link>

                  <Link
                    href="/wishList"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <Heart className="h-4 w-4" />

                    <span>{`${t("wishList"||"WishList")} ${
                      wishlistLength !== 0 ? wishlistLength : ""
                    } `}</span>
                  </Link>
                  {/* add items */}

                  <Link
                    href="/profile/settings/editItem/new"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <CirclePlus className="h-4 w-4" />
                    <span>{t("addanewitem") || "Add a new item"}</span>
                  </Link>

                  <Link
                    href="/customerService"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <HandPlatter className="h-4 w-4" />

                    <span>{t("customerService")}</span>
                  </Link>

                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("logout")}</span>
                  </Link>
                </nav>
              </div>
            ) : (
              <div className="mt-4 border-t pt-4 md:hidden">
                <nav className="flex flex-col gap-2">
                  <div className="my-2 border-t"></div>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <User className="h-4 w-4" />
                    <span>{t("signIn")}</span>
                  </Link>
                  <Link
                    href="/customerService"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                  >
                    <span>{t("customerService")}</span>
                  </Link>
                </nav>
              </div>
            ))}
        </div>

        {/* Categories navigation */}
        <div className="border-t bg-background">
          <div className="container overflow-x-auto">
            <nav className="flex space-x-4 py-2">
              {categoriesName.map((category, i) => (
                <Link
                  key={i}
                  href={`/categories/${category}`}
                  className={cn(
                    "whitespace-nowrap px-3 py-1 text-sm capitalize",
                    pathname === category
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {t(category)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}

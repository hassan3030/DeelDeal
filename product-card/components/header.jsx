"use client";

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

  const getOffers = async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken(token);
      const offers = await getOfferById(id);
      console.log("offers", offers); // Check what is returned
      setCartLength(Array.isArray(offers) ? offers.length : 0);
    }
  };
  const getNotifications = async () => {
    const token = await getCookie();
    if (token) {
      const { id } = await decodedToken(token);
      const notifications = await getOffersNotifications(id);
      console.log("notifications", notifications);
      setNotificationsLength(
        Array.isArray(notifications) ? notifications.length : 0
      );
    }
  };

  const logout = async () => {
    await removeCookie();
    setUser(null);
    router.refresh();
  };

  useEffect(() => {
    getUser();
    getOffers();
    getNotifications();

    //  router.refresh();
  }, []);

  useEffect(() => {
    if (filter === "") {
      router.push("/");
    } else if (filter.trim() !== "") {
      handlegetProductSearchFilter();
    }
    // Do nothing if filter is just whitespace
  }, [filter]);

  return (
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
              <span className="text-sm font-medium">{isRTL ? "EN" : "عر"}</span>
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
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handlegetProductSearchFilter();
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
                      <Link href={`profile/settings/editProfile/`}>
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
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {notificationsLength}
                    </span>
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
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartLength}
                    </span>
                    <span className="sr-only">{t("cart")}</span>
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
                        <Link href={`profile/settings/editProfile/`}>
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
                    {`${t("notifications")} ${notificationsLength} `}{" "}
                  </span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{`${t("cart")} ${cartLength} `}</span>
                </Link>
                <Link
                  href="/customerService"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10"
                >
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
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreditCard, Heart, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/language-provider"
import { useTranslations } from "@/lib/use-translations"
// import { useAuth } from "@/lib/auth-context"

// Mock data for orders
const orders = [
  {
    id: "ORD-001",
    date: "2023-05-10",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: "PROD-1",
        name: "Wireless Earbuds",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80&text=Earbuds",
      },
      {
        id: "PROD-2",
        name: "Phone Case",
        price: 24.99,
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80&text=Case",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2023-04-28",
    status: "processing",
    total: 349.99,
    items: [
      {
        id: "PROD-3",
        name: "Smart Watch",
        price: 349.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80&text=Watch",
      },
    ],
  },
]

// Mock data for wishlist
const wishlist = [
  {
    id: "PROD-4",
    name: "Laptop Stand",
    price: 49.99,
    image: "/placeholder.svg?height=80&width=80&text=Stand",
  },
  {
    id: "PROD-5",
    name: "Wireless Keyboard",
    price: 89.99,
    image: "/placeholder.svg?height=80&width=80&text=Keyboard",
  },
  {
    id: "PROD-6",
    name: "External SSD 1TB",
    price: 129.99,
    image: "/placeholder.svg?height=80&width=80&text=SSD",
  },
]

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100&text=JD",
  address: "123 Main St, Anytown, USA",
  phone: "+1 (555) 123-4567",
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const { isRTL } = useLanguage()
  const { t } = useTranslations()
  // const { logout } = useAuth()

  // const handleLogout = () => {
  //   logout()
  //   router.push("/")
  // }

  const sidebarItems = [
    { id: "overview", label: t("dashboard"), icon: LayoutDashboard },
    { id: "orders", label: t("orders"), icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: t("profile"), icon: User },
    { id: "settings", label: t("settings"), icon: Settings },
  ]

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="hidden md:block">
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={userData.avatar || "/placeholder.svg"} alt={userData.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeTab === item.id
                      ? "bg-primary-yellow text-gray-900"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                // onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden">
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="overview">{t("dashboard")}</TabsTrigger>
              <TabsTrigger value="orders">{t("orders")}</TabsTrigger>
              <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{t("dashboard")}</h1>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <Package className="mb-2 h-8 w-8 text-primary-orange" />
                    <p className="text-sm font-medium">{t("orders")}</p>
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <Heart className="mb-2 h-8 w-8 text-primary-orange" />
                    <p className="text-sm font-medium">Wishlist</p>
                    <h3 className="text-2xl font-bold">{wishlist.length}</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <ShoppingCart className="mb-2 h-8 w-8 text-primary-orange" />
                    <p className="text-sm font-medium">Cart</p>
                    <h3 className="text-2xl font-bold">0</h3>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex flex-col items-center p-6">
                    <CreditCard className="mb-2 h-8 w-8 text-primary-orange" />
                    <p className="text-sm font-medium">Saved Cards</p>
                    <h3 className="text-2xl font-bold">2</h3>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-xl font-semibold">Recent Orders</h2>

              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.slice(0, 2).map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs ${
                                  order.status === "delivered"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:items-end">
                            <span className="font-bold">${order.total.toFixed(2)}</span>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                      <Button className="mt-4 bg-primary-orange text-white hover:bg-deep-orange" asChild>
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {orders.length > 2 && (
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setActiveTab("orders")}>
                      View All Orders
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{t("orders")}</h1>

              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle>Order #{order.id}</CardTitle>
                            <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-xs ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-between border-t pt-4">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">${order.total.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                      <Button className="mt-4 bg-primary-orange text-white hover:bg-deep-orange" asChild>
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Wishlist</h1>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.length > 0 ? (
                  wishlist.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex items-center justify-between">
                              <p className="font-bold">${item.price.toFixed(2)}</p>
                              <Button size="sm" className="bg-primary-orange text-white hover:bg-deep-orange">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="sm:col-span-2 lg:col-span-3">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Your wishlist is empty.</p>
                      <Button className="mt-4 bg-primary-orange text-white hover:bg-deep-orange" asChild>
                        <Link href="/">Explore Products</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{t("profile")}</h1>

              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full">
                      <Image
                        src={userData.avatar || "/placeholder.svg"}
                        alt={userData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{userData.name}</h2>
                      <p className="text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="font-medium">Contact Information</h3>
                      <div className="mt-2 grid gap-2">
                        <div className="grid grid-cols-2 gap-4 rounded-lg border p-3">
                          <span className="text-sm text-muted-foreground">Email</span>
                          <span>{userData.email}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 rounded-lg border p-3">
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <span>{userData.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium">Address</h3>
                      <div className="mt-2 rounded-lg border p-3">
                        <p>{userData.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="bg-primary-orange text-white hover:bg-deep-orange">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{t("settings")}</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary-orange p-1">
                      <div className="h-4 w-4 rounded-full bg-white"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">SMS Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive text messages about your orders</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-muted p-1">
                      <div className="ml-auto h-4 w-4 rounded-full bg-muted-foreground"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password regularly for better security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

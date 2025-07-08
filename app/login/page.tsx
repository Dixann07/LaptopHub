"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { initializeUsers, loginUser } from "@/lib/auth"
import { initializeInventory } from "@/lib/inventory"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"customer" | "admin">("customer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [recentUsers, setRecentUsers] = useState<{ email: string; type: "customer" | "admin" }[]>([])

  // Initialize data on first load
  useEffect(() => {
    initializeUsers()
    initializeInventory()

    // Get recent users from localStorage
    const storedRecentUsers = localStorage.getItem("recentUsers")
    if (storedRecentUsers) {
      setRecentUsers(JSON.parse(storedRecentUsers))
    }
  }, [])

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      const userType = localStorage.getItem("userType")
      if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const selectRecentUser = (email: string, type: "customer" | "admin") => {
    setFormData((prev) => ({ ...prev, email }))
    setUserType(type)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Attempt login
    const result = loginUser(formData.email, formData.password)

    if (result.success && result.user) {
      // Check if user role matches selected tab
      if (
        (userType === "admin" && result.user.role !== "admin") ||
        (userType === "customer" && result.user.role !== "customer")
      ) {
        setError(`This account is not registered as a ${userType}. Please use the correct login tab.`)
        setIsLoading(false)
        return
      }

      // Store user info in localStorage
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userType", result.user.role)
      localStorage.setItem("currentUser", JSON.stringify(result.user))

      // Add to recent users
      const newRecentUser = { email: formData.email, type: result.user.role as "customer" | "admin" }
      const updatedRecentUsers = [
        newRecentUser,
        ...recentUsers.filter((user) => user.email !== formData.email).slice(0, 2),
      ]
      localStorage.setItem("recentUsers", JSON.stringify(updatedRecentUsers))

      toast({
        title: "Login successful",
        description: `You've been logged in as a ${result.user.role}.`,
      })

      // Redirect based on user type
      if (result.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    } else {
      setError(result.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        {/* Changed background to gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-900" />

        {/* Logo at top */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <ShoppingBag className="mr-2 h-6 w-6" />
          Laptop Hub
        </div>

        {/* Centered welcome message */}
        <div className="relative z-20 flex flex-grow items-center justify-center">
          <h2 className="text-3xl font-bold text-center">Welcome To Laptop Hub</h2>
        </div>

        {/* Quote block at bottom */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Laptop Hub has made it incredibly easy to manage our laptop inventory and serve customers efficiently.&rdquo;
            </p>
            <footer className="text-sm">Dikshan KC, CEO of Laptop Hub Nepal</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to Laptop Hub</h1>
            <p className="text-sm text-muted-foreground">Log in to manage your orders, cart, or inventory</p>
          </div>

          {recentUsers.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium">Recent logins</h2>
              <div className="flex flex-col gap-2">
                {recentUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => selectRecentUser(user.email, user.type)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                        {user.type === "admin" ? "A" : "C"}
                      </div>
                      <span>{user.email}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Tabs
            defaultValue="customer"
            value={userType}
            className="w-full"
            onValueChange={(value) => setUserType(value as "customer" | "admin")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Customer Login</CardTitle>
                    <CardDescription>Access your account to shop laptops and accessories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="admin">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Manage Laptop Hub inventory, users, and reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-password">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="admin-password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Demo admin credentials:</p>
                      <p>Email: admin@example.com</p>
                      <p>Password: admin123</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


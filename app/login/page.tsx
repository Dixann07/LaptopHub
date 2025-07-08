"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, AlertCircle, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { initializeUsers, loginUser, setUserSession, isLoggedIn, getUserRole } from "@/lib/auth"
import { initializeInventory } from "@/lib/inventory"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"customer" | "admin">("customer")
  const [showPassword, setShowPassword] = useState(false)
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
      try {
        setRecentUsers(JSON.parse(storedRecentUsers))
      } catch (error) {
        console.error("Error parsing recent users:", error)
        localStorage.removeItem("recentUsers")
      }
    }
  }, [])

  // Check if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      const userRole = getUserRole()
      if (userRole === "admin") {
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
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate form
      if (!formData.email.trim() || !formData.password) {
        setError("Please fill in all fields")
        return
      }

      // Attempt login
      const result = loginUser(formData.email.trim(), formData.password)

      if (result.success && result.user) {
        // Check if user role matches selected tab
        if (
          (userType === "admin" && result.user.role !== "admin") ||
          (userType === "customer" && result.user.role !== "customer")
        ) {
          setError(`This account is not registered as a ${userType}. Please use the correct login tab.`)
          return
        }

        // Set user session
        setUserSession(result.user)

        // Add to recent users
        const newRecentUser = { email: formData.email.trim(), type: result.user.role as "customer" | "admin" }
        const updatedRecentUsers = [
          newRecentUser,
          ...recentUsers.filter((user) => user.email !== formData.email.trim()).slice(0, 2),
        ]
        localStorage.setItem("recentUsers", JSON.stringify(updatedRecentUsers))

        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.name}!`,
        })

        // Small delay to show toast
        setTimeout(() => {
          // Redirect based on user type
          if (result.user.role === "admin") {
            router.push("/admin/dashboard")
          } else {
            router.push("/customer/dashboard")
          }
        }, 500)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <ShoppingBag className="mr-2 h-6 w-6" />
          ShopTrack
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;ShopTrack has completely transformed how we manage our inventory. We've reduced stockouts by 75%
              and improved our order fulfillment rate.&rdquo;
            </p>
            <footer className="text-sm">Sarah Johnson, CEO of StyleHub</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>

          {recentUsers.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-medium">Recent logins</h2>
              <div className="flex flex-col gap-2">
                {recentUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start bg-transparent"
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
                    <CardDescription>
                      Access your customer account to view orders and manage your profile
                    </CardDescription>
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
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
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
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Demo customer credentials:</p>
                      <p>Email: john@example.com</p>
                      <p>Password: customer123</p>
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
                    <CardDescription>Access your admin dashboard to manage inventory and users</CardDescription>
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
                        disabled={isLoading}
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
                      <div className="relative">
                        <Input
                          id="admin-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Default admin credentials:</p>
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
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


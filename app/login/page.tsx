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
  const [isLoginView, setIsLoginView] = useState(true)

  useEffect(() => {
    initializeUsers()
    initializeInventory()
    const storedRecentUsers = localStorage.getItem("recentUsers")
    if (storedRecentUsers) {
      setRecentUsers(JSON.parse(storedRecentUsers))
    }
  }, [])

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

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.")
      setIsLoading(false)
      return
    }

    const result = loginUser(formData.email, formData.password)

    if (result.success && result.user) {
      if (
        (userType === "admin" && result.user.role !== "admin") ||
        (userType === "customer" && result.user.role !== "customer")
      ) {
        setError(`This account is not registered as a ${userType}. Please use the correct tab.`)
        setIsLoading(false)
        return
      }

      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userType", result.user.role)
      localStorage.setItem("currentUser", JSON.stringify(result.user))

      const newRecentUser = { email: formData.email, type: result.user.role as "customer" | "admin" }
      const updatedRecentUsers = [
        newRecentUser,
        ...recentUsers.filter((user) => user.email !== formData.email).slice(0, 2),
      ]
      localStorage.setItem("recentUsers", JSON.stringify(updatedRecentUsers))

      toast({
        title: "Login Successful",
        description: `Welcome back! You've logged in as ${result.user.role}.`,
      })

      router.push(result.user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard")
    } else {
      setError(result.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <ShoppingBag className="mr-2 h-6 w-6" />
          Laptop Hub
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-lg">
              To keep connected with us please login with your personal info
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {isLoginView ? (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">SIGN IN</h1>
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

              <Card>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4 pt-6">
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
                  <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "SIGN IN"}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" size="icon">
                        <span className="sr-only">Facebook</span>
                        f
                      </Button>
                      <Button variant="outline" size="icon">
                        <span className="sr-only">Google</span>
                        G+
                      </Button>
                      <Button variant="outline" size="icon">
                        <span className="sr-only">LinkedIn</span>
                        in
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Card>

              <p className="px-8 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsLoginView(false)}>
                  Create Account
                </Button>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
              </div>

              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="icon">
                      <span className="sr-only">Facebook</span>
                      f
                    </Button>
                    <Button variant="outline" size="icon">
                      <span className="sr-only">Google</span>
                      G+
                    </Button>
                    <Button variant="outline" size="icon">
                      <span className="sr-only">LinkedIn</span>
                      in
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        or use your email for registration
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" required />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">SIGN UP</Button>
                </CardFooter>
              </Card>

              <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsLoginView(true)}>
                  Sign In
                </Button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

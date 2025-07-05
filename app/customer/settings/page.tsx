"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserSettings {
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    orderUpdates: boolean
    promotions: boolean
    newProducts: boolean
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date().toISOString(),
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      orderUpdates: true,
      promotions: false,
      newProducts: true,
    },
  })

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    // Load user settings from localStorage or use defaults
    const savedSettings = localStorage.getItem(`userSettings_${userData.id}`)
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    } else {
      // Initialize with user data
      setSettings((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        },
      }))
    }

    setLoading(false)
  }, [router])

  const saveSettings = () => {
    if (!user) return

    // Save settings to localStorage
    localStorage.setItem(`userSettings_${user.id}`, JSON.stringify(settings))

    // Update user information in the users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          name: settings.personalInfo.name,
          email: settings.personalInfo.email,
          phone: settings.personalInfo.phone,
          address: settings.personalInfo.address,
        }
      }
      return u
    })
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user
    const updatedUser = {
      ...user,
      name: settings.personalInfo.name,
      email: settings.personalInfo.email,
      phone: settings.personalInfo.phone,
      address: settings.personalInfo.address,
    }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setUser(updatedUser)

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handlePersonalInfoChange = (field: keyof typeof settings.personalInfo, value: string) => {
    setSettings((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }))
  }

  const handleNotificationToggle = (field: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }))
  }

  const handleSecurityToggle = (field: keyof typeof settings.security) => {
    if (field === "twoFactorEnabled") {
      setSettings((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          twoFactorEnabled: !prev.security.twoFactorEnabled,
        },
      }))
    }
  }

  const handlePasswordChange = () => {
    setPasswordError("")
    setPasswordSuccess("")

    // Validate current password
    if (!currentPassword) {
      setPasswordError("Please enter your current password")
      return
    }

    // In a real app, we would verify the current password against the stored password
    // For this demo, we'll just check if it's not empty

    // Validate new password
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    // Update password in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          password: newPassword,
        }
      }
      return u
    })
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update security settings
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        lastPasswordChange: new Date().toISOString(),
      },
    }))

    // Clear password fields
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordSuccess("Password updated successfully")

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <Button onClick={saveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details. This information will be used for shipping and contact purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input
                  id="address"
                  value={settings.personalInfo.address}
                  onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Personal Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={() => handleSecurityToggle("twoFactorEnabled")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications from us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={() => handleNotificationToggle("smsNotifications")}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Updates</p>
                    <p className="text-sm text-muted-foreground">Notifications about your orders and shipping</p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={() => handleNotificationToggle("orderUpdates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotions and Deals</p>
                    <p className="text-sm text-muted-foreground">Special offers, discounts, and promotional events</p>
                  </div>
                  <Switch
                    checked={settings.notifications.promotions}
                    onCheckedChange={() => handleNotificationToggle("promotions")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Product Announcements</p>
                    <p className="text-sm text-muted-foreground">Be the first to know about new products</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newProducts}
                    onCheckedChange={() => handleNotificationToggle("newProducts")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

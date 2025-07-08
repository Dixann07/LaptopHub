"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart, Laptop, ArrowLeft, CreditCard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getProducts, getCart, updateCartItemQuantity, removeFromCart, createOrder } from "@/lib/inventory"

interface CartItemWithProduct {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
    category: string
    specifications?: {
      processor?: string
      ram?: string
      storage?: string
    }
  }
}

interface ShippingAddress {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("esewa")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nepal",
  })

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userType = localStorage.getItem("userType")

    if (!isLoggedIn || userType !== "customer") {
      router.push("/login")
    }

    // Pre-fill user data
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
      }))
    }
  }, [router])

  // Load cart items
  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = () => {
    const cart = getCart()
    const products = getProducts()

    const cartWithProducts: CartItemWithProduct[] = cart
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.id)
        return {
          id: cartItem.id,
          quantity: cartItem.quantity,
          product: product || {
            id: cartItem.id,
            name: "Unknown Product",
            price: 0,
            image: "/placeholder.svg?height=400&width=400&text=Unknown",
            category: "unknown",
          },
        }
      })
      .filter((item) => item.product.name !== "Unknown Product")

    setCartItems(cartWithProducts)
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const result = updateCartItemQuantity(productId, newQuantity)

    if (result.success) {
      loadCartItems()
      toast({
        title: "Cart Updated",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const removeItem = (productId: string) => {
    const success = removeFromCart(productId)

    if (success) {
      loadCartItems()
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      })
    }
  }

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase()

    switch (code) {
      case "LAPTOP10":
        setDiscount(0.1)
        toast({
          title: "Promo Code Applied!",
          description: "10% discount applied to your order.",
        })
        break
      case "FREESHIP":
        setDiscount(0.05)
        toast({
          title: "Free Shipping!",
          description: "5% discount applied (equivalent to free shipping).",
        })
        break
      case "STUDENT15":
        setDiscount(0.15)
        toast({
          title: "Student Discount Applied!",
          description: "15% student discount applied to your order.",
        })
        break
      case "NEWUSER20":
        setDiscount(0.2)
        toast({
          title: "New User Discount!",
          description: "20% new user discount applied to your order.",
        })
        break
      default:
        toast({
          title: "Invalid Promo Code",
          description: "Please check your promo code and try again.",
          variant: "destructive",
        })
    }
  }

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all delivery address fields.",
        variant: "destructive",
      })
      return false
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleCheckout = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please log in to complete your order.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const user = JSON.parse(currentUser)

    const result = createOrder(user.id, user.name, user.email, shippingAddress, paymentMethod)

    if (result.success) {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${result.order?.id} has been placed. You will be redirected to ${paymentMethod} for payment.`,
      })

      // Simulate payment gateway redirect
      setTimeout(() => {
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
        })
        router.push("/customer/orders")
      }, 3000)
    } else {
      toast({
        title: "Order Failed",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discountAmount = subtotal * discount
  const tax = (subtotal - discountAmount) * 0.13 // 13% VAT in Nepal
  const shipping = subtotal > 150000 ? 0 : 2000 // Free shipping over NPR 150,000
  const total = subtotal - discountAmount + tax + shipping

  const formatNPR = (amount: number) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/customer/dashboard">
              <div className="flex items-center gap-2">
                <Laptop className="h-6 w-6" />
                <span className="text-xl font-bold">LaptopHub Nepal</span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 container py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some laptops to your cart to get started.</p>
            <Link href="/customer/dashboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/customer/dashboard">
            <div className="flex items-center gap-2">
              <Laptop className="h-6 w-6" />
              <span className="text-xl font-bold">LaptopHub Nepal</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/customer/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Badge variant="secondary">{cartItems.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items List */}
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="object-cover rounded-md"
                        fill
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {item.product.category}
                          </Badge>
                          {item.product.specifications && (
                            <div className="text-sm text-muted-foreground mt-2">
                              <p>{item.product.specifications.processor}</p>
                              <p>
                                {item.product.specifications.ram} • {item.product.specifications.storage}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{formatNPR(item.product.price)}</p>
                          <p className="text-sm text-muted-foreground">each</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="font-semibold">{formatNPR(item.product.price * item.quantity)}</p>
                          <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      placeholder="e.g., Kathmandu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Province *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      placeholder="e.g., Bagmati"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                      placeholder="e.g., 44600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="esewa" id="esewa" />
                      <Label htmlFor="esewa" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          eS
                        </div>
                        eSewa
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="khalti" id="khalti" />
                      <Label htmlFor="khalti" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          K
                        </div>
                        Khalti
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="ime_pay" id="ime_pay" />
                      <Label htmlFor="ime_pay" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          IM
                        </div>
                        IME Pay
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="fonepay" id="fonepay" />
                      <Label htmlFor="fonepay" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          FP
                        </div>
                        FonePay
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                      <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          COD
                        </div>
                        Cash on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          BT
                        </div>
                        Bank Transfer
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatNPR(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>-{formatNPR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>VAT (13%)</span>
                  <span>{formatNPR(tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatNPR(shipping)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatNPR(total)}</span>
                </div>
              </CardContent>

              <CardFooter className="flex-col space-y-4">
                <div className="w-full space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Try: LAPTOP10, FREESHIP, STUDENT15, or NEWUSER20</p>
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                  {isLoading ? "Processing..." : `Place Order - ${formatNPR(total)}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


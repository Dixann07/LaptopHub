"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Heart, Share2, Cpu, HardDrive, Monitor, Battery, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getProductById, addToCart } from "@/lib/inventory"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      const foundProduct = getProductById(params.id as string)
      setProduct(foundProduct)
      setLoading(false)
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    const result = addToCart(product.id, quantity)

    if (result.success) {
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/customer/cart")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The laptop you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Out of Stock", color: "destructive" }
    if (quantity < 5) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "success" }
  }

  const stockStatus = getStockStatus(product.quantity)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-lg">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  {product.quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5" />
                  <span className="text-sm text-gray-600 ml-1">(4.5)</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                <Badge variant={stockStatus.color as "default" | "destructive" | "warning" | "success"}>
                  {stockStatus.label}
                </Badge>
              </div>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-white p-6 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">Rs. {product.price.toLocaleString("en-IN")}</div>
              <p className="text-sm text-gray-600">Price includes all taxes</p>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white p-6 rounded-lg">
              <Label className="text-base font-semibold mb-3 block">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={quantity >= product.quantity}
                >
                  +
                </Button>
                <span className="text-sm text-gray-600 ml-4">{product.quantity} available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleAddToCart} disabled={product.quantity <= 0} className="flex-1" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.quantity <= 0}
                variant="outline"
                className="flex-1 bg-transparent"
                size="lg"
              >
                Buy Now
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.specifications.processor && (
                  <div className="flex items-start gap-3">
                    <Cpu className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Processor</h3>
                      <p className="text-gray-600">{product.specifications.processor}</p>
                    </div>
                  </div>
                )}
                {product.specifications.ram && (
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Memory (RAM)</h3>
                      <p className="text-gray-600">{product.specifications.ram}</p>
                    </div>
                  </div>
                )}
                {product.specifications.storage && (
                  <div className="flex items-start gap-3">
                    <HardDrive className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Storage</h3>
                      <p className="text-gray-600">{product.specifications.storage}</p>
                    </div>
                  </div>
                )}
                {product.specifications.graphics && (
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Graphics</h3>
                      <p className="text-gray-600">{product.specifications.graphics}</p>
                    </div>
                  </div>
                )}
                {product.specifications.display && (
                  <div className="flex items-start gap-3">
                    <Monitor className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Display</h3>
                      <p className="text-gray-600">{product.specifications.display}</p>
                    </div>
                  </div>
                )}
                {product.specifications.battery && (
                  <div className="flex items-start gap-3">
                    <Battery className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Battery Life</h3>
                      <p className="text-gray-600">{product.specifications.battery}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Free Shipping</h4>
                <p className="text-sm text-gray-600">Free delivery within Kathmandu Valley</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold">30-Day Returns</h4>
                <p className="text-sm text-gray-600">Easy returns within 30 days of purchase</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold">Warranty</h4>
                <p className="text-sm text-gray-600">1-year manufacturer warranty included</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">eSewa</h4>
                <p className="text-sm text-gray-600">Pay securely with eSewa wallet</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold">Khalti</h4>
                <p className="text-sm text-gray-600">Quick payment with Khalti</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold">Cash on Delivery</h4>
                <p className="text-sm text-gray-600">Pay when you receive your order</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

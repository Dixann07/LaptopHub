"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getProducts, addToCart } from "@/lib/inventory"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts()
      setProducts(allProducts.slice(0, 3))
    }

    loadProducts()
  }, [])

  const handleAddToCart = (productId: string, productName: string) => {
    const result = addToCart(productId, 1)

    if (result.success) {
      toast({
        title: "Added to Cart",
        description: `${productName} has been added to your cart.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Featured Laptops</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            No laptops available at the moment. Please check back during Dashain & Tihar festival!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-orange-50">
      <div className="container mx-auto px-4">

        {/* Festival Offer Banner */}
        <div className="bg-red-600 text-white py-4 px-6 rounded-lg text-center mb-10 shadow-md">
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Dashain & Tihar Mega Sale – Up to 30% Off!
            <Sparkles className="w-6 h-6" />
          </h3>
          <p className="text-sm mt-1">Enjoy massive savings on selected laptops during this festive season.</p>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-red-700">Featured Laptops</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrate this Dashain & Tihar with top laptops at unbeatable prices!
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative h-64 overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.quantity <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  {product.quantity > 0 && product.quantity < 5 && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">Low Stock</Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white">30% OFF</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl font-semibold line-clamp-2">{product.name}</CardTitle>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-gray-600">4.5</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="space-y-2 mb-4">
                  {product.specifications?.processor && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Processor:</span> {product.specifications.processor}
                    </div>
                  )}
                  {product.specifications?.ram && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">RAM:</span> {product.specifications.ram}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-red-600">
                    Rs. {(product.price * 0.7).toLocaleString("en-IN")}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex gap-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
                <Button
                  onClick={() => handleAddToCart(product.id, product.name)}
                  disabled={product.quantity <= 0}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              View All Laptops
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

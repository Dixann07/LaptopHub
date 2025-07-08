import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, ShoppingBag, Users, BarChart3, Zap, Shield, Headphones } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Laptop className="h-6 w-6" />
                <span className="text-xl font-bold">LaptopHub</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary text-primary">
              Home
            </Link>
            <Link href="/products" className="font-medium transition-colors hover:text-primary">
              Laptops
            </Link>
            <Link href="/about" className="font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose LaptopHub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted destination for premium laptops with expert guidance and unbeatable service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Latest Technology</CardTitle>
                <CardDescription>
                  Cutting-edge laptops with the newest processors, graphics cards, and innovative features.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Warranty & Support</CardTitle>
                <CardDescription>
                  Comprehensive warranty coverage and 24/7 technical support for all your laptop needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Headphones className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Expert Advice</CardTitle>
                <CardDescription>
                  Our laptop specialists help you find the perfect device for your work, gaming, or creative needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container">
            
            <FeaturedProducts />
            <div className="text-center mt-8">
              <Link href="/products">
                <Button size="lg">
                  View All Laptops
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find the perfect laptop for your specific needs and use case.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Gaming Laptops</CardTitle>
                <CardDescription>High-performance laptops for gaming enthusiasts</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Business Laptops</CardTitle>
                <CardDescription>Professional laptops for work and productivity</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Ultrabooks</CardTitle>
                <CardDescription>Thin, light, and powerful for on-the-go professionals</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">2-in-1 Convertibles</CardTitle>
                <CardDescription>Versatile laptops that transform into tablets</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Laptop?</h2>
            <p className="text-lg mb-8 opacity-90">
              Browse our extensive collection of premium laptops from top brands like Apple, Dell, ASUS, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Shop Laptops Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Get Expert Advice
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Laptop className="h-6 w-6" />
              <span className="text-xl font-bold">LaptopHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premier destination for premium laptops and expert service.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="font-medium">Quick Links</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/products" className="hover:underline">
                Laptops
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="font-medium">Categories</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="/products?category=gaming" className="hover:underline">
                Gaming Laptops
              </Link>
              <Link href="/products?category=business" className="hover:underline">
                Business Laptops
              </Link>
              <Link href="/products?category=ultrabook" className="hover:underline">
                Ultrabooks
              </Link>
              <Link href="/products?category=convertible" className="hover:underline">
                2-in-1 Convertibles
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="font-medium">Legal</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="container flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:py-3">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © 2024 LaptopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

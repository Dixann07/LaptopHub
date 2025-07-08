import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, ShoppingBag, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xl font-bold">Laptop Hub</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/products" className="font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/about" className="font-medium transition-colors hover:text-primary text-primary">
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
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">About Laptop Hub</h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Your trusted destination for high-quality laptops and accessories—designed for students, professionals, and gamers.
            </p>
          </div>

          <div className="grid gap-10 px-4 md:grid-cols-2 md:gap-16 mt-12">
            <div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter">Our Mission</h2>
                <p className="text-muted-foreground">
                  Our mission is to provide a seamless and trustworthy online platform where students, professionals, and tech enthusiasts can discover and purchase high-quality laptops at unbeatable prices—backed by expert advice, fast shipping, and excellent customer service.
                </p>
                <p className="text-muted-foreground">
                  Since 2025, Laptop Hub has been committed to delivering top-quality laptops and accessories online, helping thousands of customers find reliable tech at the best value.
                </p>
              </div>
            </div>
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/image (11).png?height=600&width=800&text=Our+Team"
                alt="Laptop Hub Team"
                className="object-cover"
                fill
              />
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Wide Laptop Selection</h3>
                <p className="text-muted-foreground">
                  Browse a wide variety of laptops from top brands—ranging from gaming powerhouses to ultrabooks—tailored to your needs and budget.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Expert Support</h3>
                <p className="text-muted-foreground">
                  Get expert advice on the right device for you. Our team is here to help you choose the perfect laptop based on your needs and preferences.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast & Secure Delivery</h3>
                <p className="text-muted-foreground">
                  Enjoy quick and safe delivery of your device right to your doorstep—fully insured and tracked for your peace of mind.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Why Choose Laptop Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Easy to Shop</h3>
                    <p className="text-muted-foreground">
                      Our user-friendly website makes it easy to compare, choose, and order laptops with just a few clicks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Affordable Prices</h3>
                    <p className="text-muted-foreground">
                      Get competitive pricing and exclusive online deals on premium laptops, accessories, and bundles.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Trusted Quality</h3>
                    <p className="text-muted-foreground">
                      Every product is sourced from trusted brands and verified sellers—ensuring genuine quality and customer satisfaction.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Flexible Range</h3>
                    <p className="text-muted-foreground">
                      Whether you need a laptop for work, school, content creation, or gaming—we have a device for every purpose.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Secure Shopping</h3>
                    <p className="text-muted-foreground">
                      Your privacy and payment information are protected with industry-grade encryption and secure checkout.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Dedicated Support</h3>
                    <p className="text-muted-foreground">
                      Our team is always ready to assist you with questions, order updates, or technical help—any time you need.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-6">Ready to find your next laptop?</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
              Join thousands of happy customers who trust Laptop Hub for their laptop and accessory needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
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
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xl font-bold">Laptop Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">Powering your digital world—one laptop at a time.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="font-medium">Quick Links</div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/products" className="hover:underline">
                Products
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
              © 2025 Laptop Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


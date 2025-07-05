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
                <span className="text-xl font-bold">ShopTrack</span>
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
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">About ShopTrack</h1>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Your complete solution for inventory management and e-commerce operations
            </p>
          </div>

          <div className="grid gap-10 px-4 md:grid-cols-2 md:gap-16 mt-12">
            <div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter">Our Mission</h2>
                <p className="text-muted-foreground">
                  At ShopTrack, our mission is to empower businesses of all sizes with powerful yet simple inventory
                  management tools. We believe that effective inventory management is the backbone of any successful
                  e-commerce operation, and we're dedicated to making it accessible to everyone.
                </p>
                <p className="text-muted-foreground">
                  Founded in 2020, ShopTrack has grown from a simple stock tracking tool to a comprehensive platform
                  that helps thousands of businesses streamline their operations, reduce costs, and grow their revenue.
                </p>
              </div>
            </div>
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800&text=Our+Team"
                alt="ShopTrack Team"
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
                <h3 className="text-xl font-bold">Inventory Management</h3>
                <p className="text-muted-foreground">
                  Track your inventory in real-time, set up low stock alerts, and manage your products with ease. Our
                  system helps you avoid stockouts and overstock situations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Customer Management</h3>
                <p className="text-muted-foreground">
                  Build stronger relationships with your customers by tracking their purchase history, preferences, and
                  contact information all in one place.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Analytics & Reporting</h3>
                <p className="text-muted-foreground">
                  Gain valuable insights into your business with detailed reports on sales, inventory turnover, and
                  customer behavior. Make data-driven decisions to grow your business.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Why Choose ShopTrack?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Easy to Use</h3>
                    <p className="text-muted-foreground">
                      Our intuitive interface makes it easy for anyone to manage inventory, regardless of technical
                      expertise.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Affordable</h3>
                    <p className="text-muted-foreground">
                      Flexible pricing plans that grow with your business, from startups to enterprise-level operations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Reliable</h3>
                    <p className="text-muted-foreground">
                      99.9% uptime guarantee ensures your business operations run smoothly without interruption.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Scalable</h3>
                    <p className="text-muted-foreground">
                      Whether you have 10 products or 10,000, ShopTrack scales with your business needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Secure</h3>
                    <p className="text-muted-foreground">
                      Enterprise-grade security protects your data and your customers' information.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-bold">Excellent Support</h3>
                    <p className="text-muted-foreground">
                      Our dedicated support team is available 24/7 to help you with any questions or issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-6">Ready to streamline your inventory?</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
              Join thousands of businesses that use ShopTrack to manage their inventory and grow their business.
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
                  Contact Sales
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
              <span className="text-xl font-bold">ShopTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">Streamline your inventory management with ShopTrack.</p>
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
              © 2024 ShopTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

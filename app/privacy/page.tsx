import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
        <section className="container py-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
              <p>Last updated: April 16, 2024</p>

              <h2>1. Introduction</h2>
              <p>
                ShopTrack ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website or use our
                services.
              </p>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will
                alert you about any changes by updating the "Last updated" date of this Privacy Policy. You are
                encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>

              <h2>2. Collection of Your Information</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect via the
                Service includes:
              </p>

              <h3>Personal Data</h3>
              <p>
                Personally identifiable information, such as your name, shipping address, email address, and telephone
                number, and demographic information, such as your age, gender, hometown, and interests, that you
                voluntarily give to us when you register with the Service or when you choose to participate in various
                activities related to the Service. You are under no obligation to provide us with personal information
                of any kind, however your refusal to do so may prevent you from using certain features of the Service.
              </p>

              <h3>Derivative Data</h3>
              <p>
                Information our servers automatically collect when you access the Service, such as your IP address, your
                browser type, your operating system, your access times, and the pages you have viewed directly before
                and after accessing the Service.
              </p>

              <h3>Financial Data</h3>
              <p>
                Financial information, such as data related to your payment method (e.g. valid credit card number, card
                brand, expiration date) that we may collect when you purchase, order, return, exchange, or request
                information about our services from the Service. We store only very limited, if any, financial
                information that we collect. Otherwise, all financial information is stored by our payment processor and
                you are encouraged to review their privacy policy and contact them directly for responses to your
                questions.
              </p>

              <h2>3. Use of Your Information</h2>
              <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized
                experience. Specifically, we may use information collected about you via the Service to:
              </p>
              <ul>
                <li>Create and manage your account.</li>
                <li>Process your orders and manage your inventory.</li>
                <li>Email you regarding your account or order.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Service.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                <li>Notify you of updates to the Service.</li>
                <li>Resolve disputes and troubleshoot problems.</li>
                <li>Respond to product and customer service requests.</li>
                <li>Send you a newsletter.</li>
              </ul>

              <h2>4. Disclosure of Your Information</h2>
              <p>
                We may share information we have collected about you in certain situations. Your information may be
                disclosed as follows:
              </p>

              <h3>By Law or to Protect Rights</h3>
              <p>
                If we believe the release of information about you is necessary to respond to legal process, to
                investigate or remedy potential violations of our policies, or to protect the rights, property, and
                safety of others, we may share your information as permitted or required by any applicable law, rule, or
                regulation.
              </p>

              <h3>Third-Party Service Providers</h3>
              <p>
                We may share your information with third parties that perform services for us or on our behalf,
                including payment processing, data analysis, email delivery, hosting services, customer service, and
                marketing assistance.
              </p>

              <h3>Marketing Communications</h3>
              <p>
                With your consent, or with an opportunity for you to withdraw consent, we may share your information
                with third parties for marketing purposes, as permitted by law.
              </p>

              <h2>5. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal
                information. While we have taken reasonable steps to secure the personal information you provide to us,
                please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
                method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>

              <h2>6. Contact Us</h2>
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
              <p>
                ShopTrack
                <br />
                123 Commerce Street
                <br />
                Suite 400
                <br />
                New York, NY 10001
                <br />
                privacy@shoptrack.com
              </p>
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

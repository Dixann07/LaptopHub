import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
              <p>Last updated: April 16, 2024</p>

              <h2>1. Introduction</h2>
              <p>
                Welcome to ShopTrack ("Company", "we", "our", "us")! As you have clicked "I agree" to these Terms of
                Service, you have entered into a legally binding contract with us. These Terms of Service govern your
                access to and use of the ShopTrack website and services.
              </p>

              <h2>2. Communications</h2>
              <p>
                By creating an Account on our service, you agree to subscribe to newsletters, marketing or promotional
                materials and other information we may send. However, you may opt out of receiving any, or all, of these
                communications from us by following the unsubscribe link or instructions provided in any email we send.
              </p>

              <h2>3. Purchases</h2>
              <p>
                If you wish to purchase any product or service made available through the Service ("Purchase"), you may
                be asked to supply certain information relevant to your Purchase including, without limitation, your
                credit card number, the expiration date of your credit card, your billing address, and your shipping
                information.
              </p>
              <p>
                You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment
                method(s) in connection with any Purchase; and that (ii) the information you supply to us is true,
                correct and complete.
              </p>

              <h2>4. Subscriptions</h2>
              <p>
                Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in
                advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly or
                annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
              </p>

              <h2>5. Free Trial</h2>
              <p>
                We may, at our sole discretion, offer a Subscription with a free trial for a limited period of time
                ("Free Trial"). You may be required to enter your billing information in order to sign up for the Free
                Trial. If you do enter your billing information when signing up for the Free Trial, you will not be
                charged by us until the Free Trial has expired.
              </p>

              <h2>6. Refunds</h2>
              <p>Except when required by law, paid Subscription fees are non-refundable.</p>

              <h2>7. Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post
                on or through the Service, including its legality, reliability, and appropriateness.
              </p>

              <h2>8. Prohibited Uses</h2>
              <p>
                You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to
                use the Service:
              </p>
              <ul>
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>
                  To transmit, or procure the sending of, any advertising or promotional material, including any "junk
                  mail", "chain letter," "spam," or any other similar solicitation.
                </li>
                <li>
                  To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other
                  person or entity.
                </li>
              </ul>

              <h2>9. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding Content provided by users), features and functionality
                are and will remain the exclusive property of ShopTrack and its licensors. The Service is protected by
                copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and
                trade dress may not be used in connection with any product or service without the prior written consent
                of ShopTrack.
              </p>

              <h2>10. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                not limited to a breach of the Terms.
              </p>

              <h2>11. Limitation Of Liability</h2>
              <p>
                In no event shall ShopTrack, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your
                access to or use of or inability to access or use the Service; (ii) any conduct or content of any third
                party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or
                alteration of your transmissions or content, whether based on warranty, contract, tort (including
                negligence) or any other legal theory, whether or not we have been informed of the possibility of such
                damage.
              </p>

              <h2>12. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole discretion.
              </p>

              <h2>13. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at support@shoptrack.com.</p>
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

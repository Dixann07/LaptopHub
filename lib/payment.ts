"use server"

import { redirect } from "next/navigation"

interface EsewaPaymentData {
  amount: number
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

interface KhaltiPaymentData {
  amount: number
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

// eSewa Payment Integration
export async function initiateEsewaPayment(paymentData: EsewaPaymentData) {
  try {
    const { amount, productId, productName, customerName, customerEmail, customerPhone } = paymentData

    // Convert amount to paisa (eSewa requires amount in paisa)
    const amountInPaisa = Math.round(amount * 100)

    const esewaConfig = {
      amt: amountInPaisa,
      pdc: 0, // Delivery charge
      psc: 0, // Service charge
      txAmt: 0, // Tax amount
      tAmt: amountInPaisa, // Total amount
      pid: `LAPTOP-${productId}-${Date.now()}`, // Product ID
      scd: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST", // Merchant code
      su: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`, // Success URL
      fu: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`, // Failure URL
    }

    // Create form data for eSewa
    const formData = new URLSearchParams()
    Object.entries(esewaConfig).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    // Store payment info in session/database for verification
    // In a real app, you'd store this in a database
    const paymentInfo = {
      orderId: esewaConfig.pid,
      amount: amount,
      customerName,
      customerEmail,
      customerPhone,
      productName,
      timestamp: new Date().toISOString(),
    }

    // Store in localStorage for demo (in production, use database)
    if (typeof window !== "undefined") {
      localStorage.setItem(`payment_${esewaConfig.pid}`, JSON.stringify(paymentInfo))
    }

    // Redirect to eSewa
    const esewaUrl = "https://uat.esewa.com.np/epay/main"
    const redirectUrl = `${esewaUrl}?${formData.toString()}`

    redirect(redirectUrl)
  } catch (error) {
    console.error("eSewa payment initiation failed:", error)
    redirect("/payment/failure")
  }
}

// Khalti Payment Integration
export async function initiateKhaltiPayment(paymentData: KhaltiPaymentData) {
  try {
    const { amount, productId, productName, customerName, customerEmail, customerPhone } = paymentData

    // Convert amount to paisa (Khalti requires amount in paisa)
    const amountInPaisa = Math.round(amount * 100)

    const khaltiPayload = {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      website_url: process.env.NEXT_PUBLIC_BASE_URL,
      amount: amountInPaisa,
      purchase_order_id: `LAPTOP-${productId}-${Date.now()}`,
      purchase_order_name: productName,
      customer_info: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    }

    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khaltiPayload),
    })

    const data = await response.json()

    if (data.payment_url) {
      // Store payment info for verification
      const paymentInfo = {
        orderId: khaltiPayload.purchase_order_id,
        amount: amount,
        customerName,
        customerEmail,
        customerPhone,
        productName,
        khaltiToken: data.pidx,
        timestamp: new Date().toISOString(),
      }

      // Store in localStorage for demo (in production, use database)
      if (typeof window !== "undefined") {
        localStorage.setItem(`payment_${khaltiPayload.purchase_order_id}`, JSON.stringify(paymentInfo))
      }

      redirect(data.payment_url)
    } else {
      throw new Error("Failed to get Khalti payment URL")
    }
  } catch (error) {
    console.error("Khalti payment initiation failed:", error)
    redirect("/payment/failure")
  }
}

// Verify eSewa Payment
export async function verifyEsewaPayment(oid: string, amt: string, refId: string) {
  try {
    const verificationUrl = "https://uat.esewa.com.np/epay/transrec"
    const formData = new URLSearchParams({
      amt: amt,
      scd: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
      rid: refId,
      pid: oid,
    })

    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const result = await response.text()

    if (result.includes("Success")) {
      return { success: true, message: "Payment verified successfully" }
    } else {
      return { success: false, message: "Payment verification failed" }
    }
  } catch (error) {
    console.error("eSewa verification failed:", error)
    return { success: false, message: "Payment verification error" }
  }
}

// Verify Khalti Payment
export async function verifyKhaltiPayment(pidx: string) {
  try {
    const response = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    })

    const data = await response.json()

    if (data.status === "Completed") {
      return { success: true, message: "Payment verified successfully", data }
    } else {
      return { success: false, message: "Payment verification failed" }
    }
  } catch (error) {
    console.error("Khalti verification failed:", error)
    return { success: false, message: "Payment verification error" }
  }
}

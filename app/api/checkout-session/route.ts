import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
})

type CartItemsPayload = {
  activeParts?: Array<{ id: string; name: string; price: number }>
  selectedExtras?: Array<{ id: string; name: string; price: number }>
  selectedStorage?: { id?: string; name: string; price: number } | null
}

function getPaymentIntentId(paymentIntent: Stripe.Checkout.Session["payment_intent"] | null): string | null {
  if (!paymentIntent) {
    return null
  }
  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id")
    if (!sessionId) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    })

    const orderIdFromMetadata = session.metadata?.orderId
    const paymentIntentId = getPaymentIntentId(session.payment_intent)
    const isPaid = session.payment_status === "paid"

    if (isPaid) {
      const paidData = {
        status: "PAID" as const,
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date(),
      }

      if (orderIdFromMetadata) {
        await prisma.order.update({
          where: { id: orderIdFromMetadata },
          data: paidData,
        })
      } else {
        await prisma.order.updateMany({
          where: { stripeSessionId: session.id },
          data: paidData,
        })
      }
    }

    return NextResponse.json(
      {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        status: isPaid ? "PAID" : "PENDING",
        orderId: orderIdFromMetadata ?? null,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Session confirmation error:", error)
    return NextResponse.json({ error: "Failed to confirm checkout session" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  let orderId: string | null = null

  try {
    const { cartItems, total, email } = (await request.json()) as {
      cartItems: CartItemsPayload
      total: number
      email: string
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
    }

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Total amount is invalid" }, { status: 400 })
    }

    const amountInCents = Math.round(total * 100)

    const order = await prisma.order.create({
      data: {
        email,
        amountMinor: amountInCents,
        currency: "PKR",
        status: "PENDING",
        cartItems,
        selectedStorage: cartItems?.selectedStorage?.name ?? null,
      },
    })

    orderId = order.id

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "HelmX Smart Helmet Configuration",
              description: "Custom-configured smart helmet with selected parts and storage",
              images: ["https://helmx.dev/helmet-preview.png"],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/buy/success?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/buy/success?payment=cancelled`,
      metadata: {
        orderId: order.id,
      },
      client_reference_id: order.id,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 })
  } catch (error) {
    console.error("Stripe error:", error)
    if (orderId) {
      await prisma.order
        .update({
          where: { id: orderId },
          data: { status: "FAILED" },
        })
        .catch(() => null)
    }
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { sendSmtpEmail } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {})
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

type CartItem = { name?: string; price?: number; description?: string }
type OrderCart = {
  activeParts?: CartItem[]
  selectedExtras?: CartItem[]
  selectedStorage?: string | null
}

function formatOrderReceiptHtml(order: {
  email: string
  amountMinor: number
  currency: string
  cartItems: unknown
  selectedStorage: string | null
}) {
  const cart = order.cartItems as OrderCart | null
  const activeParts = Array.isArray(cart?.activeParts) ? cart.activeParts : []
  const selectedExtras = Array.isArray(cart?.selectedExtras) ? cart.selectedExtras : []
  const invoiceDate = new Date().toLocaleString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const lineItems = [
    ...activeParts.map((item) => ({
      name: item.name || "Item",
      description: item.description || "Included in your build",
      price: Number(item.price || 0),
    })),
    ...selectedExtras.map((item) => ({
      name: item.name || "Extra",
      description: item.description || "Optional add-on",
      price: Number(item.price || 0),
    })),
  ]

  if (order.selectedStorage || cart?.selectedStorage) {
    lineItems.push({
      name: `Storage: ${order.selectedStorage || cart?.selectedStorage || "Not selected"}`,
      description: "Storage option for your HelmX configuration",
      price: 0,
    })
  }

  const lineItemsHtml = lineItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #E5E7EB;">
            <div style="font-weight: 600; font-size: 13px; line-height: 1.35; color: #111827;">${item.name}</div>
            <div style="font-size: 11px; line-height: 1.35; color: #6B7280; margin-top: 3px;">${item.description}</div>
          </td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600; font-size: 13px; color: #111827; white-space: nowrap;">
            ${item.price.toLocaleString("en-PK")} PKR
          </td>
        </tr>
      `,
    )
    .join("")

  return `
    <div style="font-family: Arial, sans-serif; max-width: 720px; margin: 0 auto; background: #ffffff; color: #111827; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0F172A 0%, #111827 100%); color: #ffffff; padding: 28px 32px;">
        <div style="font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #93C5FD !important;">HelmX Receipt</div>
        <h1 style="margin: 8px 0 0; font-size: 28px; line-height: 1.2; color: #FFFFFF !important; -webkit-text-fill-color: #FFFFFF !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);">Payment received</h1>
        <p style="margin: 10px 0 0; font-size: 15px; color: #F8FAFC !important; -webkit-text-fill-color: #F8FAFC !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <div style="padding: 32px;">
        <p style="margin: 0 0 20px; font-size: 15px; color: #111827;">Hi ${order.email},</p>

        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 24px;">
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">Receipt Date</div>
            <div style="margin-top: 6px; font-weight: 700; color: #111827;">${invoiceDate}</div>
          </div>
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">Customer Email</div>
            <div style="margin-top: 6px; font-weight: 700; color: #111827; word-break: break-word;">${order.email}</div>
          </div>
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">Payment Status</div>
            <div style="margin-top: 6px; font-weight: 700; color: #047857;">Paid</div>
          </div>
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">Order Total</div>
            <div style="margin-top: 6px; font-weight: 700; color: #111827;">${(order.amountMinor / 100).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${order.currency}</div>
          </div>
        </div>

        <div style="border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #F9FAFB; text-align: left;">
                <th style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">Description</th>
                <th style="padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${lineItemsHtml || `
                <tr>
                  <td colspan="2" style="padding: 18px 16px; color: #6B7280; font-size: 12px;">No item details were attached to this order.</td>
                </tr>
              `}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 14px 16px; font-weight: 700; color: #111827; font-size: 13px;">Total</td>
                <td style="padding: 14px 16px; font-weight: 800; text-align: right; color: #111827; font-size: 13px; white-space: nowrap;">${(order.amountMinor / 100).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${order.currency}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background: #F9FAFB; border-radius: 12px; padding: 16px 18px; color: #374151; line-height: 1.6; font-size: 13px;">
          <div><strong>Storage:</strong> ${order.selectedStorage || cart?.selectedStorage || "Not selected"}</div>
          <div><strong>What happens next:</strong> We are preparing your order and will contact you if we need any further details.</div>
        </div>

        <p style="margin: 24px 0 0; color: #374151;">Best regards,<br/>The HelmX Team</p>
      </div>
    </div>
  `
}

async function markOrderPaid(session: Stripe.Checkout.Session, paymentIntentId: string | null) {
  const sessionOrderId = session.metadata?.orderId ?? session.client_reference_id ?? undefined

  if (sessionOrderId) {
    return prisma.order.update({
      where: { id: sessionOrderId },
      data: {
        status: "PAID",
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date(),
      },
    })
  }

  return prisma.order.upsert({
    where: { stripeSessionId: session.id },
    update: {
      status: "PAID",
      stripePaymentIntentId: paymentIntentId,
      paidAt: new Date(),
    },
    create: {
      email: session.customer_email || "unknown@helmx.dev",
      amountMinor: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || "PKR",
      status: "PAID",
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      cartItems: {},
      selectedStorage: null,
      paidAt: new Date(),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null
        const orderRecord = await markOrderPaid(session, paymentIntentId)

        if (orderRecord?.email) {
          try {
            const receiptEmailResponse = await sendSmtpEmail({
              to: orderRecord.email,
              subject: "HelmX Receipt - Payment Confirmed",
              html: formatOrderReceiptHtml({
                email: orderRecord.email,
                amountMinor: orderRecord.amountMinor,
                currency: orderRecord.currency,
                cartItems: orderRecord.cartItems,
                selectedStorage: orderRecord.selectedStorage,
              }),
            })

            console.log("Purchase receipt sent:", receiptEmailResponse)
          } catch (emailError) {
            console.error("Failed to send purchase receipt:", emailError)
          }
        } else {
          console.log("No customer email found on order; skipping purchase receipt send.")
        }

        console.log("Payment successful:", session.id)
        break
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session
        const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null

        await markOrderPaid(session, paymentIntentId)
        console.log("Async payment successful:", session.id)
        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment intent succeeded:", paymentIntent.id)
        break
      }

      case "charge.failed": {
        const charge = event.data.object as Stripe.Charge
        console.log("Charge failed:", charge.id)

        if (typeof charge.payment_intent === "string") {
          await prisma.order
            .updateMany({
              where: { stripePaymentIntentId: charge.payment_intent },
              data: { status: "FAILED" },
            })
            .catch(() => null)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

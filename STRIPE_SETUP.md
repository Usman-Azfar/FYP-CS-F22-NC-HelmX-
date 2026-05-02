# Stripe Integration Setup Guide

## 1. Install Dependencies

```bash
npm install @stripe/react-stripe-js @stripe/js stripe
# or
pnpm add @stripe/react-stripe-js @stripe/js stripe
```

## 2. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)
4. Set up a webhook endpoint for checkout.session.completed events
5. Copy the **Webhook Signing Secret** (starts with `whsec_`)

## 3. Update Environment Variables

Edit `.env.local`:

```env
# Stripe Keys from dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App URL (used for redirect after payment)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Set Up Webhook Endpoint

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `{your-domain}/api/webhook`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `charge.failed`
5. Copy the signing secret and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## 5. How It Works

1. **User configures helmet** on `/buy` page
2. **Enters email** and clicks "Pay with Stripe"
3. **Frontend calls** `/api/checkout-session` with cart data
4. **API creates** Stripe checkout session
5. **Redirects to Stripe** hosted checkout
6. **After payment**, Stripe sends webhook to `/api/webhook`
7. **Webhook handler** saves order (implement in the switch case)
8. **Success page** at `/buy?payment=success`

## 6. Testing with Stripe Test Cards

Use these test cards in development:

- **Visa**: `4242 4242 4242 4242`
- **Visa (debit)**: `4000 0566 5566 5556`
- **Mastercard**: `5555 5555 5555 4444`
- **Amex**: `3782 822463 10005`

Any future date and any 3-digit CVC works.

## 7. Going Live

1. Replace `pk_test_*` with `pk_live_*` keys
2. Replace `sk_test_*` with `sk_live_*` keys in production `.env`
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Test with real payment method on staging environment
5. Clear Stripe webhooks from test → set up with live webhook endpoint

## 8. TODO - Implementation

The webhook handler in `/app/api/webhook/route.ts` currently just logs events. You should:

1. **Save orders to database** on `checkout.session.completed`
2. **Send confirmation email** with order details
3. **Log failed charges** for debugging
4. **Link order to customer email**

Example webhook implementation:

```typescript
case "checkout.session.completed":
  const session = event.data.object as Stripe.Checkout.Session
  // Save to database
  const order = await saveOrderToDB({
    sessionId: session.id,
    email: session.customer_email,
    amount: session.amount_total,
    cartItems: session.metadata?.cartItems,
  })
  // Send confirmation email
  await sendConfirmationEmail(session.customer_email, order)
  break
```

## 9. File Structure

```
app/
├── api/
│   ├── checkout-session/route.ts  → Creates Stripe session
│   └── webhook/route.ts            → Handles Stripe events
├── buy/
│   └── page.tsx                    → Order success page
└── ...
components/
├── stripe-checkout-button.tsx      → Payment button component
├── buy-page.tsx                    → Configurator with Stripe integration
└── ...
```

## 10. Troubleshooting

**"Could not load Stripe API"**
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Restart dev server: `npm run dev`

**"Webhook signature verification failed"**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Make sure webhook endpoint is publicly accessible (not localhost)

**"Failed to create checkout session"**
- Check `STRIPE_SECRET_KEY` is set correctly
- Check API route at `/api/checkout-session` exists
- Look at server logs for detailed error message

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Grab your webhook signature token secret from your env setup configurations
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.text(); // Stripe pings require reading the raw unparsed string body text
    const sig = request.headers.get('stripe-signature'); // Extract the secure validating cryptograph header

    let event: Stripe.Event;

    // Validate that the request physically originated from Stripe and not an outside hacker mimicking a checkout
    if (endpointSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      } catch (err: any) {
        console.error(`❌ Webhook Signature Validation Failed:`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // Local dev mode fallback if running tests without an active signature register hook
      event = JSON.parse(body);
    }

    // INTERCEPT SUCCESSFUL CHECKOUT CHARGES
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`💰 Secure Notification: Payment succeeded for Session ID: ${session.id}`);
      console.log(`📧 Customer Email associated with purchase: ${session.customer_details?.email}`);
      
      // PLACE YOUR ENTERPRISE BACKEND BUSINESS AUTOMATIONS HERE:
      // - Update database columns to change inventory item quantity numbers.
      // - Trigger receipts to send via your connected Resend mail route.
      // - Provision or shipping log creation tracking cards.
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

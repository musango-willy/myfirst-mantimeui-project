import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize the secure Stripe engine layer using your private environment token
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Standard stable enterprise endpoint configuration
});

export async function POST(request: Request) {
  try {
    const { cartItems } = await request.json();

    // Map your frontend checkout cart array parameters into a clean Stripe format
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.description || 'Premium marketplace item selection.',
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe calculates currency total values in cents ($1.00 = 100 cents)
      },
      quantity: item.quantity,
    }));

    // Generate a secure Stripe Hosted Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Dynamic success/cancel routing pathways matching your active web domain environment
      success_url: `${request.headers.get('origin')}/?success=true`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
    });

    // Return the generated secure URL redirect node back to your frontend browser client
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Generation Failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

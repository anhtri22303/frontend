import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalAmount, orderID } = body;

    console.log('Received amount:', totalAmount);
    console.log('Received orderID:', orderID);

    if (!totalAmount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('Creating Stripe session for amount:', totalAmount, 'and orderID:', orderID);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Cart Payment',
              },
              unit_amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?orderID=${orderID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cart`,
        metadata: {
          orderID: orderID,
        },
      });

      console.log('Stripe session created:', session.id);

      return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
      console.error('Stripe session creation error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create Stripe session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

const getBaseUrl = (req) => {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { promptId, email } = await request.json()

    if (!promptId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    const { data: prompt, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .eq('status', 'approved')
      .single()

    if (error || !prompt) {
      console.error('Prompt not found:', error)
      return NextResponse.json(
        { error: 'Prompt not found or not available' }, 
        { status: 404 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured')
      return NextResponse.json(
        { error: 'Payment system not configured' }, 
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: prompt.title,
              description: prompt.description,
            },
            unit_amount: Math.round(prompt.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${getBaseUrl()}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/prompt/${promptId}`,
      metadata: {
        promptId,
        buyerEmail: email,
      },
    })

    console.log('Checkout session URL:', session.url)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred creating checkout session' }, 
      { status: 500 }
    )
  }
}
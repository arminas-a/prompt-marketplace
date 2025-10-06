import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { promptId, email } = await request.json()

    // Get prompt details
    const { data: prompt, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .eq('status', 'approved')
      .single()

    if (error || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Create Stripe checkout session
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
            unit_amount: Math.round(prompt.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/prompt/${promptId}`,
      metadata: {
        promptId,
        buyerEmail: email,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
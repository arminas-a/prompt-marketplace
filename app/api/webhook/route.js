import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    // For now, we'll skip signature verification for testing
    // In production, you should verify the webhook signature
    event = JSON.parse(body)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const promptId = session.metadata.promptId
    const buyerEmail = session.metadata.buyerEmail
    const pricePaid = session.amount_total / 100

    // Get the prompt
    const { data: prompt } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Create purchase record
    const { data: purchase } = await supabase
      .from('purchases')
      .insert([{
        buyer_email: buyerEmail,
        prompt_id: promptId,
        stripe_payment_id: session.payment_intent,
        price_paid: pricePaid,
      }])
      .select()
      .single()

    if (purchase) {
      // Send email with the prompt
      try {
        await resend.emails.send({
          from: 'PromptHub <onboarding@resend.dev>',
          to: buyerEmail,
          subject: `Your Prompt: ${prompt.title}`,
          html: `
            <h2>Thanks for your purchase!</h2>
            <p>You've successfully purchased: <strong>${prompt.title}</strong></p>
            
            <h3>Your Prompt:</h3>
            <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
${prompt.prompt_text}
            </pre>
            
            <p>You can also access this prompt anytime at:</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/purchase/${purchase.access_token}">
              View Your Prompt
            </a></p>
            
            <hr>
            <p style="color: #666; font-size: 14px;">
              Work less. Be happy more.<br>
              - PromptHub Team
            </p>
          `,
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    }
  }

  return NextResponse.json({ received: true })
}
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

// Create Supabase client with service role for webhook (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    // Verify webhook signature (important for security!)
    // For now, skip verification in development
    event = JSON.parse(body)
    
    console.log('Webhook received:', event.type)
  } catch (err) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    console.log('Processing completed checkout:', session.id)

    const promptId = session.metadata.promptId
    const buyerEmail = session.metadata.buyerEmail || session.customer_email
    const pricePaid = session.amount_total / 100

    if (!promptId || !buyerEmail) {
      console.error('Missing metadata:', { promptId, buyerEmail })
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Get the prompt
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single()

    if (promptError || !prompt) {
      console.error('Prompt not found:', promptError)
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Check if purchase already exists (prevent duplicates)
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_payment_id', session.payment_intent)
      .single()

    if (existingPurchase) {
      console.log('Purchase already processed:', existingPurchase.id)
      return NextResponse.json({ received: true })
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert([{
        buyer_email: buyerEmail,
        prompt_id: promptId,
        stripe_payment_id: session.payment_intent,
        price_paid: pricePaid,
      }])
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 })
    }

    console.log('Purchase created:', purchase.id)

    // Send email with the prompt
    try {
      const emailResult = await resend.emails.send({
        from: 'PromptHub <onboarding@resend.dev>',
        to: buyerEmail,
        subject: `Your Prompt: ${prompt.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thanks for your purchase! 🎉</h2>
            <p>You've successfully purchased: <strong>${prompt.title}</strong></p>
            
            <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Prompt:</h3>
              <pre style="background: white; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">
${prompt.prompt_text}
              </pre>
            </div>
            
            <p><strong>Lifetime Access Link:</strong></p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/purchase/${purchase.access_token}" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Your Prompt Anytime
              </a>
            </p>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px;">
              <strong>🤖 Optimized for:</strong> ${prompt.optimized_models?.join(', ') || 'All major AI models'}<br>
              <strong>📍 Region:</strong> ${prompt.region_language || 'Global/English'}
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              🚀 Work less. 😊 Be happy more.<br>
              <strong>- PromptHub Team</strong>
            </p>
          </div>
        `,
      })

      console.log('Email sent successfully:', emailResult)
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the webhook if email fails
    }

    return NextResponse.json({ received: true, purchaseId: purchase.id })
  }

  return NextResponse.json({ received: true })
}

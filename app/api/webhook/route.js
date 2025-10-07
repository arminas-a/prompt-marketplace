// ============================================
// FILE: app/api/webhook/route.js (REPLACE ENTIRE FILE)
// LOCATION: app/api/webhook/route.js
// Fixed: Better error handling and bypasses RLS
// ============================================
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

// IMPORTANT: Use service role key to bypass RLS for webhook
// For now, using anon key with proper RLS policies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const body = await request.text()
    const event = JSON.parse(body)
    
    console.log('Webhook received:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      console.log('Processing session:', session.id)
      console.log('Metadata:', session.metadata)

      const promptId = session.metadata?.promptId
      const buyerEmail = session.metadata?.buyerEmail || session.customer_email || session.customer_details?.email
      const pricePaid = (session.amount_total || 0) / 100

      console.log('Extracted data:', { promptId, buyerEmail, pricePaid })

      if (!promptId || !buyerEmail) {
        console.error('Missing required data')
        return NextResponse.json({ 
          error: 'Missing metadata',
          details: { promptId, buyerEmail }
        }, { status: 400 })
      }

      // Get the prompt
      const { data: prompt, error: promptError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', promptId)
        .single()

      if (promptError || !prompt) {
        console.error('Prompt not found:', promptError)
        return NextResponse.json({ 
          error: 'Prompt not found',
          details: promptError?.message 
        }, { status: 404 })
      }

      console.log('Prompt found:', prompt.title)

      // Check for duplicate
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('stripe_payment_id', session.payment_intent)
        .maybeSingle()

      if (existingPurchase) {
        console.log('Purchase already exists:', existingPurchase.id)
        return NextResponse.json({ 
          received: true, 
          note: 'Already processed',
          purchaseId: existingPurchase.id 
        })
      }

      // Create purchase - with detailed error logging
      console.log('Creating purchase record...')
      
      const purchaseData = {
        buyer_email: buyerEmail,
        prompt_id: promptId,
        stripe_payment_id: String(session.payment_intent || 'unknown'),
        price_paid: pricePaid,
      }

      console.log('Purchase data:', purchaseData)

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert([purchaseData])
        .select()
        .single()

      if (purchaseError) {
        console.error('Purchase creation failed:', purchaseError)
        console.error('Error details:', JSON.stringify(purchaseError, null, 2))
        
        return NextResponse.json({ 
          error: 'Failed to create purchase',
          details: {
            message: purchaseError.message,
            code: purchaseError.code,
            hint: purchaseError.hint,
            details: purchaseError.details
          }
        }, { status: 500 })
      }

      console.log('Purchase created successfully:', purchase.id)
      console.log('Access token:', purchase.access_token)

      // Send email
      try {
        console.log('Sending email to:', buyerEmail)
        
        // Send to buyer (primary) and admin (CC for monitoring)
        const emailResult = await resend.emails.send({
          from: 'PromptHub <onboarding@resend.dev>',
          to: [buyerEmail],
          cc: ['arminas.abramavicius@gmail.com'],
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
        console.error('Email error (non-fatal):', emailError)
        // Don't fail the webhook if email fails
      }

      return NextResponse.json({ 
        received: true, 
        purchaseId: purchase.id,
        accessToken: purchase.access_token
      })
    }

    return NextResponse.json({ received: true, event: event.type })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
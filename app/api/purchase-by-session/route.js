import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    // Find purchase by Stripe session/payment ID
    const { data, error } = await supabase
      .from('purchases')
      .select('access_token')
      .eq('stripe_payment_id', sessionId)
      .maybeSingle()

    if (error || !data) {
      // Try with pi_ prefix (payment intent ID)
      const { data: data2, error: error2 } = await supabase
        .from('purchases')
        .select('access_token')
        .ilike('stripe_payment_id', `%${sessionId}%`)
        .maybeSingle()

      if (error2 || !data2) {
        return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
      }

      return NextResponse.json({ access_token: data2.access_token })
    }

    return NextResponse.json({ access_token: data.access_token })
  } catch (error) {
    console.error('Error fetching purchase:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

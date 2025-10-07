import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request) {
  try {
    console.log('Testing email send...')

    const result = await resend.emails.send({
      from: 'PromptHub <onboarding@resend.dev>',
      to: 'arminas.abramavicius@gmail.com',
      subject: 'Test Email from PromptHub',
      html: `
        <h2>✅ Email Works!</h2>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    })

    console.log('Email result:', result)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
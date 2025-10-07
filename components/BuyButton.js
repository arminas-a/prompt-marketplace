'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BuyButton({ promptId, price }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setEmail(user.email)
      }
    })
  }, [])

  async function handleBuy() {
    if (!showEmailInput) {
      setShowEmailInput(true)
      return
    }

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId,
          email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const data = await response.json()

      if (data.url) {
        try {
          // Ensure the URL is valid
          const checkoutUrl = new URL(data.url);
          window.location.href = checkoutUrl.toString();
        } catch (urlError) {
          console.error('Invalid checkout URL:', data.url);
          throw new Error('Invalid checkout URL received from server');
        }
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div>
      {!showEmailInput ? (
        <button 
          className="btn btn-success w-100 btn-lg"
          onClick={handleBuy}
        >
          Buy Now - ${price}
        </button>
      ) : (
        <div>
          <div className="mb-3">
            <label className="form-label">Your Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <small className="text-muted">
              {user ? '✓ Using your account email' : 'We\'ll send the prompt here'}
            </small>
          </div>
          <button 
            className="btn btn-success w-100 btn-lg"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Processing...
              </>
            ) : (
              `Proceed to Payment`
            )}
          </button>
        </div>
      )}
    </div>
  )
}
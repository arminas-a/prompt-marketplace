'use client'

import { useState } from 'react'

export default function BuyButton({ promptId, price }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)

  async function handleBuy() {
    if (!showEmailInput) {
      setShowEmailInput(true)
      return
    }

    if (!email) {
      alert('Please enter your email')
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

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        alert('Error creating checkout session')
        setLoading(false)
      }
    } catch (error) {
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
            <small className="text-muted">We'll send the prompt here</small>
          </div>
          <button 
            className="btn btn-success w-100 btn-lg"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Proceed to Payment`}
          </button>
        </div>
      )}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function BuyButton({ promptId, price, sellerId }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [user, setUser] = useState(null)
  const [alreadyPurchased, setAlreadyPurchased] = useState(false)
  const [isOwnPrompt, setIsOwnPrompt] = useState(false)
  const [checkingPurchase, setCheckingPurchase] = useState(true)

  useEffect(() => {
    checkUserAndPurchase()
  }, [])

  async function checkUserAndPurchase() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUser(user)
      setEmail(user.email)
      
      if (sellerId === user.id) {
        setIsOwnPrompt(true)
        setCheckingPurchase(false)
        return
      }
      
      const { data } = await supabase
        .from('purchases')
        .select('id')
        .eq('prompt_id', promptId)
        .eq('buyer_email', user.email)
        .maybeSingle()
      
      if (data) {
        setAlreadyPurchased(true)
      }
    }
    
    setCheckingPurchase(false)
  }

  async function handleBuy() {
    if (isOwnPrompt) {
      alert('You cannot purchase your own prompt!')
      return
    }

    if (alreadyPurchased) {
      alert('You have already purchased this prompt! Check your email or account dashboard.')
      return
    }

    if (!showEmailInput) {
      setShowEmailInput(true)
      return
    }

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('buyer_email', email)
      .maybeSingle()

    if (existingPurchase) {
      alert('This email has already purchased this prompt! Check your email inbox for the prompt.')
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
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error: ' + error.message)
      setLoading(false)
    }
  }

  if (checkingPurchase) {
    return (
      <div className="text-center">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    )
  }

  if (isOwnPrompt) {
    return (
      <div className="alert alert-info mb-0">
        <strong>This is your prompt</strong>
        <p className="mb-0 small">You cannot purchase your own prompts.</p>
      </div>
    )
  }

  if (alreadyPurchased) {
    return (
      <div className="alert alert-success mb-0">
        <strong>✓ Already Purchased</strong>
        <p className="mb-0 small">Check your email or <a href="/account">account dashboard</a> to access this prompt.</p>
      </div>
    )
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
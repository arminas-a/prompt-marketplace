'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container" style={{marginTop: '4rem', marginBottom: '4rem'}}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div style={{
              backgroundColor: 'var(--ft-pink)',
              border: '1px solid var(--ft-border)',
              padding: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'var(--ft-black)',
                marginBottom: '1rem'
              }}>Check your email</h2>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1rem',
                color: 'var(--ft-grey)',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>We've sent you a confirmation link. Click it to verify your account and start selling.</p>
              <Link href="/login" className="btn btn-primary">Proceed to Login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{marginTop: '4rem', marginBottom: '4rem'}}>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div style={{
            border: '1px solid var(--ft-border)',
            backgroundColor: '#fff',
            padding: '3rem'
          }}>
            <h1 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--ft-black)',
              textAlign: 'center',
              marginBottom: '2rem',
              letterSpacing: '-0.5px'
            }}>Create Account</h1>
              
            {error && (
              <div style={{
                backgroundColor: '#FEE',
                border: '1px solid #C00',
                color: '#C00',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontFamily: 'Georgia, serif',
                fontSize: '0.9rem'
              }}>{error}</div>
            )}

            <form onSubmit={handleSignup}>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--ft-black)',
                  marginBottom: '0.5rem'
                }}>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '1rem',
                    padding: '0.75rem'
                  }}
                />
              </div>

              <div style={{marginBottom: '0.5rem'}}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Georgia, serif',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--ft-black)',
                  marginBottom: '0.5rem'
                }}>Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '1rem',
                    padding: '0.75rem'
                  }}
                />
              </div>
              <small style={{
                display: 'block',
                fontFamily: 'Georgia, serif',
                fontSize: '0.85rem',
                color: 'var(--ft-grey)',
                marginBottom: '2rem'
              }}>Minimum 6 characters</small>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
                style={{
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--ft-light-grey)'
            }}>
              <Link href="/login" style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.95rem'
              }}>Already have an account? Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
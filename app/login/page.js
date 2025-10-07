'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/sell')
      router.refresh()
    }
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
            }}>Log In</h1>
              
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

            <form onSubmit={handleLogin}>
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

              <div style={{marginBottom: '2rem'}}>
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
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: '1rem',
                    padding: '0.75rem'
                  }}
                />
              </div>

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
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--ft-light-grey)'
            }}>
              <Link href="/signup" style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.95rem'
              }}>Don't have an account? Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
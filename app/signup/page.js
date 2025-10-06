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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success">
              <h4>Check your email!</h4>
              <p>We've sent you a confirmation link. Click it to verify your account.</p>
              <Link href="/login" className="btn btn-primary">Go to Login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Sign Up to Sell</h2>
              
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <small className="text-muted">Minimum 6 characters</small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link href="/login">Already have an account? Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
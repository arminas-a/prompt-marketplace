'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [copied, setCopied] = useState(false)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAccessToken() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/purchase-by-session?session_id=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setAccessToken(data.access_token)
        }
      } catch (error) {
        console.error('Error fetching access token:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccessToken()
  }, [sessionId])

  const handleCopySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <span style={{fontSize: '80px'}}>✓</span>
              </div>
              <h2 className="mb-3">Payment Successful!</h2>
              <p className="lead mb-4">
                Thank you for your purchase! 🎉
              </p>
              <p className="text-muted mb-4">
                The prompt has been sent to your email with a unique lifetime access link. 
                You can also view your purchase in your account dashboard.
              </p>

              <div className="alert alert-info text-start mb-4">
                <h6 className="alert-heading">📧 Check Your Email</h6>
                <ul className="mb-0 ps-3">
                  <li>Full prompt text</li>
                  <li>Lifetime access link</li>
                  <li>Instructions for use</li>
                </ul>
              </div>

              <div className="d-grid gap-3">
                {loading ? (
                  <button className="btn btn-primary btn-lg" disabled>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading your purchase...
                  </button>
                ) : accessToken ? (
                  <a href={`/purchase/${accessToken}`} className="btn btn-primary btn-lg">
                    📄 View Your Prompt
                  </a>
                ) : (
                  <a href="/account" className="btn btn-primary btn-lg">
                    📄 View My Purchases
                  </a>
                )}
                <a href="/" className="btn btn-outline-primary">
                  Browse More Prompts
                </a>
              </div>

              {sessionId && (
                <div className="mt-4 pt-4 border-top">
                  <small className="text-muted d-block mb-2">Transaction ID</small>
                  <div className="d-flex gap-2 justify-content-center align-items-center">
                    <code className="small text-muted">{sessionId.substring(0, 20)}...</code>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleCopySessionId}
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted small">
              💡 Tip: Bookmark your purchase link from the email for easy access
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
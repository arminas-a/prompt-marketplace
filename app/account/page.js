// ============================================
// FILE: app/account/page.js (REPLACE ENTIRE FILE)
// LOCATION: app/account/page.js
// This fixes the deopt warning by using Suspense
// ============================================
'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

// Separate component for search params (wrapped in Suspense)
function ConfirmationAlert() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      setShow(true)
      setTimeout(() => setShow(false), 5000)
    }
  }, [searchParams])

  if (!show) return null

  return (
    <div className="alert alert-success alert-dismissible fade show">
      <strong>✓ Email Confirmed!</strong> Your account is now active.
      <button 
        type="button" 
        className="btn-close" 
        onClick={() => setShow(false)}
      ></button>
    </div>
  )
}

// Main component
function AccountPageContent() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)
    loadPurchases(user.email)
    setLoading(false)
  }

  async function loadPurchases(email) {
    const { data } = await supabase
      .from('purchases')
      .select(`
        *,
        prompt:prompts(title, description, category, price)
      `)
      .eq('buyer_email', email)
      .order('created_at', { ascending: false })

    setPurchases(data || [])
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return
    }

    if (!confirm('Really delete? All your data will be permanently removed.')) {
      return
    }

    setDeleting(true)
    alert('Account deletion requires admin approval. Please contact support.')
    setDeleting(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-4">My Account</h2>

          {/* Email Confirmed Alert - Wrapped in Suspense */}
          <Suspense fallback={null}>
            <ConfirmationAlert />
          </Suspense>

          {/* Account Info */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Account Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-muted">Email</label>
                <p className="mb-0">{user?.email}</p>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Account Created</label>
                <p className="mb-0">{new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Purchase History ({purchases.length})</h5>
            </div>
            <div className="card-body">
              {purchases.length === 0 ? (
                <p className="text-muted mb-0">No purchases yet. <a href="/">Browse prompts</a></p>
              ) : (
                <div className="list-group">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{purchase.prompt?.title}</h6>
                          <p className="mb-2 text-muted small">{purchase.prompt?.description}</p>
                          <div className="mb-2">
                            <span className="badge bg-secondary me-1">{purchase.prompt?.category}</span>
                            <span className="badge bg-primary">${purchase.price_paid}</span>
                          </div>
                          <small className="text-muted">
                            Purchased: {new Date(purchase.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <div>
                          <a 
                            href={`/purchase/${purchase.access_token}`}
                            className="btn btn-sm btn-outline-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Prompt
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Danger Zone</h5>
            </div>
            <div className="card-body">
              <h6>Delete Account</h6>
              <p className="text-muted mb-3">
                Once you delete your account, there is no going back. Your purchase history will remain accessible via email links.
              </p>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? 'Processing...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Quick Actions</h6>
              <div className="d-grid gap-2">
                <a href="/sell" className="btn btn-primary">
                  Sell Prompts
                </a>
                <a href="/" className="btn btn-outline-primary">
                  Browse Marketplace
                </a>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline-secondary"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export with Suspense wrapper
export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  )
}
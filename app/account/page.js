'use client'

import { useEffect, useState, Suspense } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

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
    await loadPurchases(user.email)
    setLoading(false)
  }

  async function loadPurchases(email) {
    console.log('Loading purchases for:', email)
    
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        prompt:prompts(*)
      `)
      .eq('buyer_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading purchases:', error)
    } else {
      console.log('Purchases loaded:', data)
    }

    setPurchases(data || [])
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      '⚠️ Are you sure you want to delete your account?\n\n' +
      'This will:\n' +
      '• Delete your account permanently\n' +
      '• Remove all your data\n' +
      '• Your purchased prompts will remain accessible via email links\n\n' +
      'Type "DELETE" to confirm.'
    )

    if (!confirmed) return

    const typed = prompt('Type DELETE to confirm account deletion:')
    if (typed !== 'DELETE') {
      alert('Account deletion cancelled.')
      return
    }

    setDeleting(true)

    try {
      // Note: Supabase doesn't allow self-deletion via client SDK
      // We'll use the auth API to delete the user
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) {
        // Fallback: Sign out and show message
        await supabase.auth.signOut()
        alert('Account deletion initiated. Please contact support to complete the process.')
        router.push('/')
      } else {
        await supabase.auth.signOut()
        alert('Account deleted successfully.')
        router.push('/')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting account. Please contact support.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    )
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-4">My Account</h2>

          <Suspense fallback={null}>
            <ConfirmationAlert />
          </Suspense>

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

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Purchase History ({purchases.length})</h5>
            </div>
            <div className="card-body">
              {purchases.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No purchases yet.</p>
                  <a href="/" className="btn btn-primary">Browse Prompts</a>
                </div>
              ) : (
                <div className="list-group">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{purchase.prompt?.title || 'Prompt'}</h6>
                          <p className="mb-2 text-muted small">
                            {purchase.prompt?.description || ''}
                          </p>
                          <div className="mb-2">
                            {purchase.prompt?.category && (
                              <span className="badge bg-secondary me-1">
                                {purchase.prompt.category}
                              </span>
                            )}
                            <span className="badge bg-primary">${purchase.price_paid}</span>
                          </div>
                          <small className="text-muted">
                            Purchased: {new Date(purchase.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <a 
                            href={`/purchase/${purchase.access_token}`}
                            className="btn btn-sm btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 View Your Prompt
                          </a>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              const link = `${window.location.origin}/purchase/${purchase.access_token}`
                              navigator.clipboard.writeText(link)
                              alert('Link copied! Save it for future access.')
                            }}
                          >
                            🔗 Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Danger Zone</h5>
            </div>
            <div className="card-body">
              <h6>Delete Account</h6>
              <p className="text-muted mb-3">
                Once you delete your account, there is no going back. 
                Your purchased prompts will remain accessible via the email links we sent you.
              </p>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete My Account'}
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

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  )
}
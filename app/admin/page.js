'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pendingPrompts, setPendingPrompts] = useState([])
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!data?.is_admin) {
      alert('Access denied. Admin only.')
      router.push('/')
      return
    }

    setIsAdmin(true)
    loadPendingPrompts()
  }

  async function loadPendingPrompts() {
    // Get ALL prompts (pending, approved, rejected) so admin can see everything
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })

    setPendingPrompts(data || [])
    setLoading(false)
  }

  async function approvePrompt(id) {
    setProcessingId(id)
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'approved' })
      .eq('id', id)

    if (!error) {
      // Reload prompts to show updated status
      loadPendingPrompts()
    } else {
      alert('Error approving prompt: ' + error.message)
    }
    setProcessingId(null)
  }

  async function rejectPrompt(id) {
    setProcessingId(id)
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (!error) {
      // Reload prompts to show updated status
      loadPendingPrompts()
    } else {
      alert('Error rejecting prompt: ' + error.message)
    }
    setProcessingId(null)
  }

  function getStatusBadge(status) {
    const badges = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      rejected: 'bg-danger'
    }
    return badges[status] || 'bg-secondary'
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const pending = pendingPrompts.filter(p => p.status === 'pending')
  const approved = pendingPrompts.filter(p => p.status === 'approved')
  const rejected = pendingPrompts.filter(p => p.status === 'rejected')

  return (
    <div className="container mt-5">
      <h2 className="text-warning mb-4">Admin Panel</h2>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h3 className="mb-0">{pending.length}</h3>
              <p className="mb-0">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h3 className="mb-0">{approved.length}</h3>
              <p className="mb-0">Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h3 className="mb-0">{rejected.length}</h3>
              <p className="mb-0">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Prompts */}
      {pending.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">⏳ Pending Review ({pending.length})</h5>
          </div>
          <div className="card-body">
            <div className="list-group">
              {pending.map((prompt) => (
                <div key={prompt.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                      <h6 className="mb-1">{prompt.title}</h6>
                      <p className="mb-2 text-muted small">{prompt.description}</p>
                      <div className="mb-2">
                        <span className="badge bg-secondary me-1">{prompt.category}</span>
                        <span className="badge bg-primary">${prompt.price}</span>
                      </div>
                      <details className="small">
                        <summary className="text-muted" style={{cursor: 'pointer'}}>View prompt preview</summary>
                        <pre className="mt-2 p-2 bg-light rounded" style={{fontSize: '0.8rem'}}>
                          {prompt.preview_text}
                        </pre>
                      </details>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => approvePrompt(prompt.id)}
                        disabled={processingId === prompt.id}
                      >
                        {processingId === prompt.id ? '...' : '✓ Approve'}
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => rejectPrompt(prompt.id)}
                        disabled={processingId === prompt.id}
                      >
                        {processingId === prompt.id ? '...' : '✗ Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Approved Prompts */}
      {approved.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">✓ Approved ({approved.length})</h5>
          </div>
          <div className="card-body">
            <div className="list-group">
              {approved.map((prompt) => (
                <div key={prompt.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{prompt.title}</h6>
                      <p className="mb-0 text-muted small">{prompt.description}</p>
                    </div>
                    <span className="badge bg-success">Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rejected Prompts */}
      {rejected.length > 0 && (
        <div className="card">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">✗ Rejected ({rejected.length})</h5>
          </div>
          <div className="card-body">
            <div className="list-group">
              {rejected.map((prompt) => (
                <div key={prompt.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{prompt.title}</h6>
                      <p className="mb-0 text-muted small">{prompt.description}</p>
                    </div>
                    <span className="badge bg-danger">Rejected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pendingPrompts.length === 0 && (
        <div className="alert alert-info">
          No prompts in the system yet.
        </div>
      )}
    </div>
  )
}
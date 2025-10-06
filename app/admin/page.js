'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pendingPrompts, setPendingPrompts] = useState([])

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
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    setPendingPrompts(data || [])
    setLoading(false)
  }

  async function approvePrompt(id) {
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'approved' })
      .eq('id', id)

    if (!error) {
      loadPendingPrompts()
      alert('Prompt approved!')
    }
  }

  async function rejectPrompt(id) {
    const { error } = await supabase
      .from('prompts')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (!error) {
      loadPendingPrompts()
      alert('Prompt rejected')
    }
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

  return (
    <div className="container mt-5">
      <h2 className="text-warning mb-4">Admin Panel</h2>

      <div className="card">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Pending Prompts ({pendingPrompts.length})</h5>
        </div>
        <div className="card-body">
          {pendingPrompts.length === 0 ? (
            <p className="text-muted mb-0">No pending prompts to review</p>
          ) : (
            <div className="list-group">
              {pendingPrompts.map((prompt) => (
                <div key={prompt.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                      <h6 className="mb-1">{prompt.title}</h6>
                      <p className="mb-2 text-muted small">{prompt.description}</p>
                      <div>
                        <span className="badge bg-secondary me-1">{prompt.category}</span>
                        <span className="badge bg-primary">${prompt.price}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => approvePrompt(prompt.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => rejectPrompt(prompt.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

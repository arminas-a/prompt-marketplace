'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myPrompts, setMyPrompts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Legal')
  const [price, setPrice] = useState('')
  const [promptText, setPromptText] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      loadMyPrompts(user.id)
      setLoading(false)
    }
  }

  async function loadMyPrompts(userId) {
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })

    setMyPrompts(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error } = await supabase
      .from('prompts')
      .insert([{
        seller_id: user.id,
        title,
        description,
        category,
        price: parseFloat(price),
        prompt_text: promptText,
        preview_text: previewText,
        status: 'pending'
      }])

    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      // Reset form
      setTitle('')
      setDescription('')
      setCategory('Legal')
      setPrice('')
      setPromptText('')
      setPreviewText('')
      setShowForm(false)
      setSubmitting(false)
      
      // Show success message (no popup!)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
      
      // Reload prompts
      loadMyPrompts(user.id)
    }
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
        <div className="spinner-border" role="status"></div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      {/* Success Toast - Better than popup! */}
      {showSuccess && (
        <div className="position-fixed top-0 end-0 p-3" style={{zIndex: 11}}>
          <div className="toast show" role="alert">
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">✓ Success</strong>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setShowSuccess(false)}
              ></button>
            </div>
            <div className="toast-body">
              Prompt submitted for approval! You'll be notified once it's reviewed.
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Sell Your Prompts</h2>
          <p className="text-muted">Logged in as: {user?.email}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Prompt'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title mb-4">Create New Prompt</h4>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., GDPR Data Processing Agreement Generator"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this prompt do? What problem does it solve?"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="Legal">Legal</option>
                    <option value="Compliance">Compliance</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Price (USD) *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="49"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Preview Text *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="First few lines of your prompt (visible to buyers before purchase)"
                  required
                />
                <small className="text-muted">
                  This is what buyers see before purchasing. Show them the quality without giving away the full prompt.
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Full Prompt Text *</label>
                <textarea
                  className="form-control"
                  rows="10"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="The complete prompt that buyers will receive after purchase..."
                  required
                />
                <small className="text-muted">
                  This will be hidden until someone purchases. Include all instructions, examples, and context.
                </small>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">My Prompts ({myPrompts.length})</h5>
        </div>
        <div className="card-body">
          {myPrompts.length === 0 ? (
            <p className="text-muted mb-0">No prompts yet. Create your first one!</p>
          ) : (
            <div className="list-group">
              {myPrompts.map((prompt) => (
                <div key={prompt.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{prompt.title}</h6>
                      <p className="mb-2 text-muted small">{prompt.description}</p>
                      <div>
                        <span className="badge bg-secondary me-1">{prompt.category}</span>
                        <span className="badge bg-primary me-1">${prompt.price}</span>
                        <span className={`badge ${getStatusBadge(prompt.status)}`}>
                          {prompt.status}
                        </span>
                      </div>
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
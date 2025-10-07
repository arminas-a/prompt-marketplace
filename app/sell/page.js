'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const MODEL_OPTIONS = [
  'GPT-4',
  'GPT-3.5',
  'Claude 3.5 Sonnet',
  'Claude 3 Opus',
  'Claude 3 Sonnet',
  'Gemini Pro',
  'Gemini Ultra',
  'Llama 3',
  'Mistral',
  'Other'
]

const REGION_OPTIONS = [
  'Global/English',
  'US/English',
  'UK/English',
  'EU/English',
  'EU/Multi-language',
  'Asia-Pacific/English',
  'Latin America/Spanish',
  'Brazil/Portuguese',
  'France/French',
  'Germany/German',
  'Other'
]

export default function SellPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myPrompts, setMyPrompts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Legal')
  const [price, setPrice] = useState('')
  const [promptText, setPromptText] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [selectedModels, setSelectedModels] = useState(['GPT-4', 'Claude 3.5 Sonnet'])
  const [regionLanguage, setRegionLanguage] = useState('Global/English')
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

  async function handleDelete(promptId, promptTitle) {
    if (!confirm(`Are you sure you want to delete "${promptTitle}"?\n\nThis action cannot be undone.`)) {
      return
    }

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId)
      .eq('seller_id', user.id)

    if (error) {
      alert('Error deleting prompt: ' + error.message)
    } else {
      alert('Prompt deleted successfully!')
      loadMyPrompts(user.id)
    }
  }

  async function handleEdit(prompt) {
    setTitle(prompt.title)
    setDescription(prompt.description)
    setCategory(prompt.category)
    setPrice(prompt.price.toString())
    setPromptText(prompt.prompt_text)
    setPreviewText(prompt.preview_text)
    setSelectedModels(prompt.optimized_models || [])
    setRegionLanguage(prompt.region_language || 'Global/English')
    setEditingId(prompt.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleModel(model) {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter(m => m !== model))
    } else {
      setSelectedModels([...selectedModels, model])
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (selectedModels.length === 0) {
      setError('Please select at least one optimized model')
      setSubmitting(false)
      return
    }

    const promptData = {
      title,
      description,
      category,
      price: parseFloat(price),
      prompt_text: promptText,
      preview_text: previewText,
      optimized_models: selectedModels,
      region_language: regionLanguage,
    }

    let error
    if (editingId) {
      // Update existing prompt
      const result = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', editingId)
        .eq('seller_id', user.id)
      error = result.error
    } else {
      // Create new prompt
      const result = await supabase
        .from('prompts')
        .insert([{
          ...promptData,
          seller_id: user.id,
          status: 'pending'
        }])
      error = result.error
    }

    if (error) {
      setError(error.message)
      setSubmitting(false)
    } else {
      setTitle('')
      setDescription('')
      setCategory('Legal')
      setPrice('')
      setPromptText('')
      setPreviewText('')
      setSelectedModels(['GPT-4', 'Claude 3.5 Sonnet'])
      setRegionLanguage('Global/English')
      setEditingId(null)
      setShowForm(false)
      setSubmitting(false)
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
      
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
    <div className="container mt-5 mb-5">
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
              {editingId ? 'Prompt updated successfully!' : 'Prompt submitted for approval! You\'ll be notified once it\'s reviewed.'}
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
          onClick={() => {
            if (showForm) {
              setShowForm(false)
              setEditingId(null)
              setTitle('')
              setDescription('')
              setCategory('Legal')
              setPrice('')
              setPromptText('')
              setPreviewText('')
              setSelectedModels(['GPT-4', 'Claude 3.5 Sonnet'])
              setRegionLanguage('Global/English')
            } else {
              setShowForm(true)
            }
          }}
        >
          {showForm ? 'Cancel' : '+ New Prompt'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4 shadow">
          <div className="card-body p-4">
            <h4 className="card-title mb-4">{editingId ? 'Edit Prompt' : 'Create New Prompt'}</h4>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Title *</label>
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
                <label className="form-label fw-bold">Description *</label>
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
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Category *</label>
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

                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Price (USD) *</label>
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

                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Region/Language *</label>
                  <select
                    className="form-select"
                    value={regionLanguage}
                    onChange={(e) => setRegionLanguage(e.target.value)}
                    required
                  >
                    {REGION_OPTIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Optimized for Models * (select all that apply)</label>
                <div className="row g-2">
                  {MODEL_OPTIONS.map(model => (
                    <div key={model} className="col-md-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`model-${model}`}
                          checked={selectedModels.includes(model)}
                          onChange={() => toggleModel(model)}
                        />
                        <label className="form-check-label" htmlFor={`model-${model}`}>
                          {model}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <small className="text-muted">
                  Selected: {selectedModels.join(', ') || 'None'}
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Preview Text *</label>
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

              <div className="mb-4">
                <label className="form-label fw-bold">Full Prompt Text *</label>
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
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {editingId ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  editingId ? 'Update Prompt' : 'Submit for Approval'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow">
        <div className="card-header bg-dark text-white">
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
                      <div className="mb-2">
                        <span className="badge bg-secondary me-1">{prompt.category}</span>
                        <span className="badge bg-primary me-1">${prompt.price}</span>
                        <span className={`badge ${getStatusBadge(prompt.status)} me-1`}>
                          {prompt.status}
                        </span>
                        {prompt.region_language && (
                          <span className="badge bg-info text-dark me-1">
                            {prompt.region_language}
                          </span>
                        )}
                      </div>
                      {prompt.optimized_models && prompt.optimized_models.length > 0 && (
                        <div>
                          <small className="text-muted">
                            🤖 Optimized for: {prompt.optimized_models.join(', ')}
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(prompt)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(prompt.id, prompt.title)}
                      >
                        🗑️ Delete
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

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import BuyButton from '../../../components/BuyButton'
import RatingStars from '../../../components/RatingStars'

export default function PromptDetailPage({ params }) {
  const [prompt, setPrompt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' })

  useEffect(() => {
    loadPrompt()
    loadReviews()
  }, [params.id])

  async function loadPrompt() {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', params.id)
      .eq('status', 'approved')
      .single()

    if (!error && data) {
      setPrompt({
        ...data,
        optimized_models: data.optimized_models || [],
        region_language: data.region_language || 'Global/English'
      })
    }
    setLoading(false)
  }

  async function loadReviews() {
    // For demo, use mock reviews. In production, you'd fetch from database
    const mockReviews = [
      {
        id: 1,
        rating: 5,
        name: 'Sarah Johnson',
        comment: 'Excellent prompt! Saved me hours of work on GDPR compliance documents.',
        date: '2025-10-05',
        verified: true
      },
      {
        id: 2,
        rating: 4,
        name: 'Michael Chen',
        comment: 'Very helpful and well-structured. Would recommend for legal professionals.',
        date: '2025-10-03',
        verified: true
      },
      {
        id: 3,
        rating: 5,
        name: 'Emma Williams',
        comment: 'Perfect for our HR department. Clear, concise, and professional.',
        date: '2025-10-01',
        verified: false
      }
    ]
    setReviews(mockReviews)
  }

  function handleSubmitReview(e) {
    e.preventDefault()
    // In production, save to database
    const review = {
      id: Date.now(),
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      verified: false
    }
    setReviews([review, ...reviews])
    setNewReview({ rating: 5, comment: '', name: '' })
    setShowReviewForm(false)
    alert('Thank you for your review! (Demo mode - not saved)')
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status"></div>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Prompt not found</h4>
          <p>This prompt doesn't exist or hasn't been approved yet.</p>
          <a href="/" className="btn btn-primary">Back to Browse</a>
        </div>
      </div>
    )
  }

  const optimizedModels = prompt.optimized_models || []
  const regionLanguage = prompt.region_language || 'Global/English'

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-8">
          <h1 className="mb-3">{prompt.title}</h1>
          
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <span className="badge bg-secondary fs-6">{prompt.category}</span>
            <span className="badge bg-primary fs-5">${prompt.price}</span>
            {regionLanguage && (
              <span className="badge bg-info text-dark fs-6">
                📍 {regionLanguage}
              </span>
            )}
          </div>

          {optimizedModels.length > 0 && (
            <div className="card mb-4 border-primary">
              <div className="card-body">
                <h6 className="card-title mb-3">
                  <i className="bi bi-robot"></i> Optimized for These AI Models:
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {optimizedModels.map((model, idx) => (
                    <span key={idx} className="badge bg-primary" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                      {model}
                    </span>
                  ))}
                </div>
                <small className="text-muted d-block mt-2">
                  ✨ This prompt has been specifically tested and optimized for the models listed above
                </small>
              </div>
            </div>
          )}

          <p className="lead">{prompt.description}</p>

          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div className="card-body">
              <pre className="mb-0" style={{
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '0.375rem'
              }}>
                {prompt.preview_text}
              </pre>
            </div>
          </div>

          <div className="alert alert-info">
            <h6>What you'll get:</h6>
            <ul className="mb-0">
              <li>Complete prompt sent to your email instantly</li>
              <li>Lifetime access via unique link</li>
              <li>Optimized for professional use</li>
              <li>Ready to use with {optimizedModels.length > 0 ? optimizedModels.join(', ') : 'major AI models'}</li>
            </ul>
          </div>

          {/* Reviews Section */}
          <div className="card mt-4">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Customer Reviews</h5>
                  <div className="d-flex align-items-center gap-2">
                    <RatingStars rating={parseFloat(avgRating)} readonly />
                    <span className="fw-bold">{avgRating}</span>
                    <span className="text-muted">({reviews.length} reviews)</span>
                  </div>
                </div>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Write Review
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Review Form */}
              {showReviewForm && (
                <div className="card mb-4 border-primary">
                  <div className="card-body">
                    <h6 className="card-title">Write a Review (Demo)</h6>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-3">
                        <label className="form-label">Your Rating</label>
                        <div>
                          <RatingStars 
                            rating={newReview.rating}
                            onRate={(rating) => setNewReview({...newReview, rating})}
                            size="large"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newReview.name}
                          onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Your Review</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">Submit Review</button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setShowReviewForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-muted text-center py-4">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="list-group list-group-flush">
                  {reviews.map((review) => (
                    <div key={review.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <strong>{review.name}</strong>
                            {review.verified && (
                              <span className="badge bg-success badge-sm">
                                <i className="bi bi-check-circle me-1"></i>Verified Purchase
                              </span>
                            )}
                          </div>
                          <RatingStars rating={review.rating} size="small" readonly />
                        </div>
                        <small className="text-muted">
                          {new Date(review.date).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-0">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top shadow-lg" style={{top: '20px', border: '2px solid #667eea'}}>
            <div className="card-body">
              <h4 className="card-title mb-3 text-center">${prompt.price}</h4>
              <BuyButton 
                promptId={prompt.id} 
                price={prompt.price}
                sellerId={prompt.seller_id}
              />
              
              <div className="mt-3 text-muted small">
                <p className="mb-1">✓ Instant email delivery</p>
                <p className="mb-1">✓ Secure payment via Stripe</p>
                <p className="mb-1">✓ No subscription required</p>
                <p className="mb-0">✓ Lifetime access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


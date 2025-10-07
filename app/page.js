'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import PromptCard from '../components/PromptCard'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function HomePage() {
  const [prompts, setPrompts] = useState([])
  const [filteredPrompts, setFilteredPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const categories = ['All', 'Legal', 'Compliance', 'HR', 'Finance', 'Marketing', 'Sales', 'IT', 'Other']

  useEffect(() => {
    loadPrompts()
  }, [])

  useEffect(() => {
    filterAndSortPrompts()
  }, [searchTerm, selectedCategory, sortBy, prompts])

  async function loadPrompts() {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPrompts(data)
      setFilteredPrompts(data)
    }
    setLoading(false)
  }

  function filterAndSortPrompts() {
    let filtered = [...prompts]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.prompt_text.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredPrompts(filtered)
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5 mb-5">
      {/* Hero Section */}
      <div className="text-center mb-5 py-5">
        <div className="mb-4">
          <span className="badge bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill">
            <i className="bi bi-robot me-2"></i>
            AI-Powered Business Solutions
          </span>
        </div>
        <h1 className="display-3 fw-bold mb-3">
          Corporate AI Prompts<br/>
          <span className="text-primary">Marketplace</span>
        </h1>
        <p className="lead text-muted mb-4 mx-auto" style={{maxWidth: '600px'}}>
          Professional, tested prompts for Legal, Compliance, HR, Finance & more.<br/>
          <strong>Work less. 😊 Be happy more.</strong>
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
          <div className="text-center">
            <div className="fs-3 fw-bold text-primary">{prompts.length}+</div>
            <small className="text-muted">Prompts</small>
          </div>
          <div className="text-center">
            <div className="fs-3 fw-bold text-success">4.8★</div>
            <small className="text-muted">Avg Rating</small>
          </div>
          <div className="text-center">
            <div className="fs-3 fw-bold text-info">$29</div>
            <small className="text-muted">Avg Price</small>
          </div>
        </div>
        {!loading && prompts.length > 0 && (
          <div className="d-flex gap-2 justify-content-center">
            <a href="#prompts" className="btn btn-primary btn-lg">
              <i className="bi bi-search me-2"></i>
              Browse Prompts
            </a>
            <a href="/sell" className="btn btn-outline-primary btn-lg">
              <i className="bi bi-upload me-2"></i>
              Sell Your Prompts
            </a>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="row mb-5 g-4" id="features">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center p-3">
            <div className="card-body">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-lightning-charge-fill text-primary fs-1"></i>
              </div>
              <h5 className="card-title">Instant Delivery</h5>
              <p className="card-text text-muted">
                Get your prompt immediately via email. No waiting, no hassle.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center p-3">
            <div className="card-body">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-shield-check text-success fs-1"></i>
              </div>
              <h5 className="card-title">Quality Tested</h5>
              <p className="card-text text-muted">
                All prompts are tested and optimized for professional use.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center p-3">
            <div className="card-body">
              <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-infinity text-info fs-1"></i>
              </div>
              <h5 className="card-title">Lifetime Access</h5>
              <p className="card-text text-muted">
                One-time payment. Access your prompt forever with a unique link.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="prompts"></div>

      {/* Search & Filter Bar */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat === 'All' ? '📂 All Categories' : `📁 ${cat}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">🕐 Newest First</option>
                <option value="oldest">🕐 Oldest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💰 Price: High to Low</option>
                <option value="title">🔤 A-Z</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-3 d-flex gap-2 align-items-center flex-wrap">
              <small className="text-muted">Active filters:</small>
              {searchTerm && (
                <span className="badge bg-primary">
                  Search: "{searchTerm}"
                  <button 
                    className="btn-close btn-close-white ms-2" 
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => setSearchTerm('')}
                  ></button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="badge bg-info">
                  Category: {selectedCategory}
                  <button 
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => setSelectedCategory('all')}
                  ></button>
                </span>
              )}
              <button 
                className="btn btn-sm btn-link text-decoration-none"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {prompts.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No prompts available yet</h4>
          <p className="mb-0">Check back soon! New prompts are being added.</p>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="alert alert-warning text-center">
          <h4>No results found</h4>
          <p className="mb-3">Try adjusting your search or filters</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
            </h5>
            {filteredPrompts.length !== prompts.length && (
              <small className="text-muted">
                (filtered from {prompts.length} total)
              </small>
            )}
          </div>
          
          <div className="row g-4">
            {filteredPrompts.map((prompt) => (
              <div key={prompt.id} className="col-md-6 col-lg-4">
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
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
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Corporate AI Prompts</h1>
        <p className="lead text-muted mb-4">
          Professional prompts for Legal, Compliance, HR, Finance & more.<br/>
          Work less. 😊 Be happy more.
        </p>
      </div>

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
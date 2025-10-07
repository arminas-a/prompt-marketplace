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
    <div className="container" style={{marginTop: '3rem', marginBottom: '4rem'}}>
      {/* Hero Section - FT Style */}
      <div style={{
        borderBottom: '4px solid var(--ft-black)',
        paddingBottom: '3rem',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '3.5rem',
          fontWeight: '700',
          color: 'var(--ft-black)',
          lineHeight: '1.1',
          marginBottom: '1.5rem',
          letterSpacing: '-1px'
        }}>
          Professional AI Prompts<br/>
          for Business Leaders
        </h1>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.25rem',
          color: 'var(--ft-grey)',
          lineHeight: '1.6',
          maxWidth: '700px',
          marginBottom: '2rem'
        }}>
          Curated, verified prompts for Legal, Compliance, HR, Finance and more. 
          Trusted by industry professionals.
        </p>
        
        <div className="d-flex gap-4 mb-4" style={{
          borderTop: '1px solid var(--ft-border)',
          borderBottom: '1px solid var(--ft-border)',
          padding: '1.5rem 0'
        }}>
          <div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--ft-black)'
            }}>{prompts.length}</div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.9rem',
              color: 'var(--ft-grey)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Verified Prompts</div>
          </div>
          <div style={{borderLeft: '1px solid var(--ft-border)', paddingLeft: '2rem'}}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--ft-black)'
            }}>4.8★</div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.9rem',
              color: 'var(--ft-grey)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Average Rating</div>
          </div>
          <div style={{borderLeft: '1px solid var(--ft-border)', paddingLeft: '2rem'}}>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--ft-black)'
            }}>$29</div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.9rem',
              color: 'var(--ft-grey)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Typical Price</div>
          </div>
        </div>

        {!loading && prompts.length > 0 && (
          <div className="d-flex gap-3">
            <a href="#prompts" className="btn btn-primary" style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem'
            }}>
              Browse Marketplace
            </a>
            <a href="/sell" className="btn btn-outline-primary" style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem'
            }}>
              Become a Seller
            </a>
          </div>
        )}
      </div>

      <div id="prompts"></div>

      {/* Search & Filter Bar - FT Style */}
      <div style={{
        border: '1px solid var(--ft-border)',
        backgroundColor: 'var(--ft-pink)',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="row g-3">
          {/* Search */}
          <div className="col-md-5">
            <label style={{
              display: 'block',
              fontFamily: 'Georgia, serif',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--ft-black)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Search</label>
            <input
              type="text"
              className="form-control"
              style={{
                fontFamily: 'Georgia, serif',
                border: '1px solid var(--ft-black)',
                padding: '0.65rem 1rem'
              }}
                  placeholder="Search by title, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="col-md-4">
            <label style={{
              display: 'block',
              fontFamily: 'Georgia, serif',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--ft-black)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                fontFamily: 'Georgia, serif',
                border: '1px solid var(--ft-black)',
                padding: '0.65rem 1rem'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="col-md-3">
            <label style={{
              display: 'block',
              fontFamily: 'Georgia, serif',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--ft-black)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontFamily: 'Georgia, serif',
                border: '1px solid var(--ft-black)',
                padding: '0.65rem 1rem'
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--ft-border)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--ft-grey)'
            }}>Active:</span>
            {searchTerm && (
              <span style={{
                backgroundColor: 'var(--ft-black)',
                color: '#fff',
                padding: '0.25rem 0.75rem',
                fontSize: '0.85rem',
                fontFamily: 'Georgia, serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                "{searchTerm}"
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '1.2rem',
                    lineHeight: '1'
                  }}
                  onClick={() => setSearchTerm('')}
                >×</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span style={{
                backgroundColor: 'var(--ft-black)',
                color: '#fff',
                padding: '0.25rem 0.75rem',
                fontSize: '0.85rem',
                fontFamily: 'Georgia, serif',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {selectedCategory}
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '1.2rem',
                    lineHeight: '1'
                  }}
                  onClick={() => setSelectedCategory('all')}
                >×</button>
              </span>
            )}
            <button 
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '0.85rem',
                color: 'var(--ft-blue)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0'
              }}
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
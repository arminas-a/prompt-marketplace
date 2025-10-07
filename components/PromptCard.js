'use client'

import Link from 'next/link'

export default function PromptCard({ prompt }) {
  const optimizedModels = prompt.optimized_models || []
  const regionLanguage = prompt.region_language || 'Global/English'
  
  return (
    <div 
      className="card h-100"
      style={{
        transition: 'all 0.2s ease',
        border: '1px solid var(--ft-border)',
        backgroundColor: '#fff',
        borderRadius: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--ft-black)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ft-border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="card-body d-flex flex-column" style={{padding: '1.5rem'}}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--ft-black)',
            marginBottom: 0,
            lineHeight: '1.3',
            flex: 1
          }}>{prompt.title}</h5>
          <span style={{
            backgroundColor: 'var(--ft-black)',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            fontSize: '1rem',
            fontWeight: '700',
            fontFamily: 'Georgia, serif',
            marginLeft: '1rem'
          }}>${prompt.price}</span>
        </div>
        
        <div className="mb-3">
          <span style={{
            backgroundColor: 'var(--ft-light-grey)',
            color: 'var(--ft-black)',
            padding: '0.25rem 0.6rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            fontFamily: 'Georgia, serif',
            marginRight: '0.5rem',
            display: 'inline-block'
          }}>{prompt.category}</span>
          {regionLanguage && (
            <span style={{
              backgroundColor: '#fff',
              color: 'var(--ft-grey)',
              padding: '0.25rem 0.6rem',
              fontSize: '0.8rem',
              fontFamily: 'Georgia, serif',
              border: '1px solid var(--ft-border)',
              display: 'inline-block'
            }}>{regionLanguage}</span>
          )}
        </div>
        
        <p style={{
          color: 'var(--ft-grey)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '1rem',
          flex: 1,
          fontFamily: 'Georgia, serif'
        }}>{prompt.description}</p>
        
        {optimizedModels.length > 0 && (
          <div className="mb-3">
            <small style={{
              color: 'var(--ft-grey)',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'block',
              marginBottom: '0.5rem',
              fontFamily: 'Georgia, serif'
            }}>Optimized for:</small>
            <div className="d-flex flex-wrap gap-1">
              {optimizedModels.slice(0, 3).map((model, idx) => (
                <span key={idx} style={{
                  backgroundColor: '#fff',
                  color: 'var(--ft-grey)',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--ft-border)',
                  fontFamily: 'Georgia, serif'
                }}>
                  {model}
                </span>
              ))}
              {optimizedModels.length > 3 && (
                <span style={{
                  backgroundColor: '#fff',
                  color: 'var(--ft-grey)',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  border: '1px solid var(--ft-border)',
                  fontFamily: 'Georgia, serif'
                }}>
                  +{optimizedModels.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div style={{
          backgroundColor: 'var(--ft-pink)',
          padding: '0.75rem',
          marginBottom: '1rem',
          border: '1px solid var(--ft-border)'
        }}>
          <small style={{
            color: 'var(--ft-grey)',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.5rem',
            fontFamily: 'Georgia, serif'
          }}>Preview:</small>
          <small style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.85rem',
            color: 'var(--ft-black)',
            lineHeight: '1.5'
          }}>
            {prompt.preview_text?.slice(0, 100)}...
          </small>
        </div>
        
        <div className="mt-auto">
          <Link 
            href={`/prompt/${prompt.id}`} 
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: 'var(--ft-black)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: 'Georgia, serif',
              fontSize: '0.95rem',
              fontWeight: '600',
              border: '1px solid var(--ft-black)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--ft-blue)'
              e.target.style.borderColor = 'var(--ft-blue)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'var(--ft-black)'
              e.target.style.borderColor = 'var(--ft-black)'
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
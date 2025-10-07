'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function PromptCard({ prompt }) {
  const optimizedModels = prompt.optimized_models || []
  const regionLanguage = prompt.region_language || 'Global'
  const [salesCount, setSalesCount] = useState(0)
  
  useEffect(() => {
    async function loadSalesCount() {
      const { count } = await supabase
        .from('purchases')
        .select('*', { count: 'exact', head: true })
        .eq('prompt_id', prompt.id)
      
      setSalesCount(count || 0)
    }
    loadSalesCount()
  }, [prompt.id])
  
  return (
    <div 
      className="card h-100 prompt-card-hover"
      style={{
        transition: 'all 0.2s ease',
        border: '2px solid var(--commando-border)',
        backgroundColor: '#1a1a1a',
        borderRadius: 0
      }}
    >
      <div className="card-body d-flex flex-column" style={{padding: '1.5rem'}}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#f0f0f0',
            marginBottom: 0,
            lineHeight: '1.3',
            flex: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>{prompt.title}</h5>
          <span style={{
            backgroundColor: 'var(--commando-green)',
            color: '#fff',
            padding: '0.4rem 0.8rem',
            fontSize: '1rem',
            fontWeight: '700',
            fontFamily: 'Georgia, serif',
            marginLeft: '1rem',
            border: '2px solid var(--commando-olive)'
          }}>${prompt.price}</span>
        </div>
        
        <div className="mb-3 d-flex gap-2 align-items-center flex-wrap">
          <span style={{
            backgroundColor: 'var(--commando-grey)',
            color: '#f0f0f0',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            fontFamily: 'Georgia, serif',
            display: 'inline-block',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            border: '1px solid var(--commando-border)'
          }}>{prompt.category}</span>
          <span style={{
            backgroundColor: '#000',
            color: 'var(--commando-highlight)',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            fontFamily: 'Georgia, serif',
            border: '1px solid var(--commando-green)',
            display: 'inline-block',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>⚡ {salesCount} DEPLOYED</span>
        </div>
        
        <p style={{
          color: '#ccc',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          marginBottom: '1rem',
          flex: 1,
          fontFamily: 'Georgia, serif'
        }}>{prompt.description}</p>
        
        {optimizedModels.length > 0 && (
          <div className="mb-3">
            <small style={{
              color: 'var(--commando-highlight)',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'block',
              marginBottom: '0.5rem',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Compatible Systems:</small>
            <div className="d-flex flex-wrap gap-1">
              {optimizedModels.slice(0, 3).map((model, idx) => (
                <span key={idx} style={{
                  backgroundColor: '#000',
                  color: '#6b8e23',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem',
                  border: '1px solid var(--commando-border)',
                  fontFamily: 'Georgia, serif',
                  textTransform: 'uppercase'
                }}>
                  {model}
                </span>
              ))}
              {optimizedModels.length > 3 && (
                <span style={{
                  backgroundColor: '#000',
                  color: '#6b8e23',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem',
                  border: '1px solid var(--commando-border)',
                  fontFamily: 'Georgia, serif'
                }}>
                  +{optimizedModels.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          <Link 
            href={`/prompt/${prompt.id}`}
            className="btn-view-details"
            style={{
              display: 'block',
              width: '100%',
              backgroundColor: 'var(--commando-green)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: 'Georgia, serif',
              fontSize: '0.9rem',
              fontWeight: '700',
              border: '2px solid var(--commando-green)',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            EXECUTE COMMAND
          </Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) checkAdmin(user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) checkAdmin(session.user.id)
      else setIsAdmin(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkAdmin(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single()
    
    setIsAdmin(data?.is_admin || false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav style={{
      backgroundColor: '#000',
      borderBottom: '3px solid var(--commando-green)',
      padding: '0'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center" style={{height: '64px'}}>
          <Link href="/" style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--commando-green)',
            textDecoration: 'none',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            ⚡ Commando
          </Link>
          
          <div className="d-flex align-items-center gap-1">
            <Link
              href="/"
              className="nav-link-hover"
              style={{
                color: '#ccc',
                padding: '0.5rem 1rem',
                fontFamily: 'Georgia, serif',
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Commands
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/sell"
                  className="nav-link-hover"
                  style={{
                    color: '#ccc',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Deploy
                </Link>
                <Link
                  href="/account"
                  className="nav-link-hover"
                  style={{
                    color: '#ccc',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Base
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    style={{
                      color: '#ff0',
                      padding: '0.5rem 1rem',
                      fontFamily: 'Georgia, serif',
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    Command Center
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="nav-link-hover"
                  style={{
                    color: '#ccc',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.9rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Exfil
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-link-hover"
                  style={{
                    color: '#ccc',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-signup"
                  style={{
                    backgroundColor: 'var(--commando-green)',
                    color: '#fff',
                    padding: '0.5rem 1.5rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    marginLeft: '0.5rem',
                    transition: 'all 0.2s',
                    border: '2px solid var(--commando-green)',
                    display: 'inline-block',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  Enlist
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

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
      backgroundColor: 'var(--ft-black)',
      borderBottom: '1px solid #000',
      padding: '0'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center" style={{height: '64px'}}>
          <Link href="/" style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: '-0.5px'
          }}>
            Prompt Marketplace
          </Link>
          
          <div className="d-flex align-items-center gap-1">
            <Link
              href="/"
              className="nav-link-hover"
              style={{
                color: '#fff',
                padding: '0.5rem 1rem',
                fontFamily: 'Georgia, serif',
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              Browse
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/sell"
                  className="nav-link-hover"
                  style={{
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Sell
                </Link>
                <Link
                  href="/account"
                  className="nav-link-hover"
                  style={{
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Account
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    style={{
                      color: 'var(--ft-pink)',
                      padding: '0.5rem 1rem',
                      fontFamily: 'Georgia, serif',
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="nav-link-hover"
                  style={{
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.95rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-link-hover"
                  style={{
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-signup"
                  style={{
                    backgroundColor: 'var(--ft-blue)',
                    color: '#fff',
                    padding: '0.5rem 1.5rem',
                    fontFamily: 'Georgia, serif',
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    marginLeft: '0.5rem',
                    transition: 'all 0.2s',
                    border: '1px solid var(--ft-blue)',
                    display: 'inline-block'
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

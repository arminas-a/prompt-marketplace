import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


// ============================================
// FILE: components/Navbar.js
// LOCATION: components/Navbar.js
// ============================================
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) checkAdmin(user.id)
    })

    // Listen for auth changes
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold">
          PromptHub
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Browse</Link>
            </li>
            
            {user ? (
              <>
                <li className="nav-item">
                  <Link href="/sell" className="nav-link">Sell Prompts</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link href="/admin" className="nav-link text-warning">Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn btn-link">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/signup" className="btn btn-primary ms-2">
                    Sign Up to Sell
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h2>Sell Your Prompts</h2>
      <p className="text-muted">Logged in as: {user?.email}</p>
      
      <div className="alert alert-info mt-4">
        <h5>Coming in Week 2:</h5>
        <ul className="mb-0">
          <li>Create new prompts</li>
          <li>Connect Stripe account</li>
          <li>View your earnings</li>
          <li>Manage your listings</li>
        </ul>
      </div>
    </div>
  )
}
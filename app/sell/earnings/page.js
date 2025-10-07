'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function EarningsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [realSales, setRealSales] = useState([])

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      await loadSales(user.id)
      setLoading(false)
    }
  }

  async function loadSales(userId) {
    // Get real sales data
    const { data: prompts } = await supabase
      .from('prompts')
      .select('id')
      .eq('seller_id', userId)

    if (prompts && prompts.length > 0) {
      const promptIds = prompts.map(p => p.id)
      const { data: purchases } = await supabase
        .from('purchases')
        .select('*, prompt:prompts(title, price)')
        .in('prompt_id', promptIds)
        .order('created_at', { ascending: false })

      setRealSales(purchases || [])
    }
  }

  // Calculate real earnings
  const realEarnings = realSales.reduce((sum, sale) => sum + (sale.price_paid || 0), 0)
  const salesCount = realSales.length

  // Mock data for demo
  const mockMonthlyData = [
    { month: 'Jan', sales: 12, revenue: 450 },
    { month: 'Feb', sales: 18, revenue: 720 },
    { month: 'Mar', sales: 25, revenue: 980 },
    { month: 'Apr', sales: 32, revenue: 1240 },
    { month: 'May', sales: 28, revenue: 1050 },
    { month: 'Jun', sales: 45, revenue: 1680 },
  ]

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    )
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="alert alert-info mb-4">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Demo Mode:</strong> Charts show simulated data for demonstration. Real sales data shown below.
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Earnings Dashboard</h2>
          <p className="text-muted mb-0">Track your sales and revenue</p>
        </div>
        <a href="/sell" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>Back to Prompts
        </a>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Earned</p>
                  <h3 className="mb-0">${realEarnings.toFixed(2)}</h3>
                  {realEarnings === 0 && <small className="text-muted">(No sales yet)</small>}
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-cash-stack text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Sales</p>
                  <h3 className="mb-0">{salesCount}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-graph-up text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Demo: Monthly</p>
                  <h3 className="mb-0">$1,680</h3>
                  <small className="text-success">+15% vs last month</small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-calendar-month text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Demo: Pending</p>
                  <h3 className="mb-0">$89.99</h3>
                  <small className="text-muted">Processing</small>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-hourglass-split text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-8 mb-3">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Revenue Trend (Demo Data)</h5>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }} className="d-flex align-items-end justify-content-around">
                {mockMonthlyData.map((month, idx) => (
                  <div key={idx} className="text-center" style={{ width: '15%' }}>
                    <div 
                      className="bg-primary mb-2 rounded"
                      style={{ 
                        height: `${(month.revenue / 2000) * 100}%`,
                        minHeight: '20px',
                        transition: 'all 0.3s'
                      }}
                      title={`$${month.revenue}`}
                    ></div>
                    <small className="text-muted">{month.month}</small>
                    <div><small><strong>${month.revenue}</strong></small></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quick Stats</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">Avg. Sale</small>
                  <small className="fw-bold">
                    ${salesCount > 0 ? (realEarnings / salesCount).toFixed(2) : '0.00'}
                  </small>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">Demo: Conversion</small>
                  <small className="fw-bold">4.2%</small>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">Demo: Return Rate</small>
                  <small className="fw-bold">8.5%</small>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '85%' }}></div>
                </div>
              </div>

              <hr />

              <button className="btn btn-outline-secondary w-100" disabled>
                <i className="bi bi-wallet2 me-2"></i>
                Request Payout (Demo)
              </button>
              <small className="text-muted d-block mt-2 text-center">
                Payout disabled in demo mode
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Real Sales Table */}
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Sales (Real Data)</h5>
        </div>
        <div className="card-body">
          {realSales.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="text-muted mt-3">No sales yet. Start selling to see them here!</p>
              <a href="/sell" className="btn btn-primary">Create Your First Prompt</a>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Prompt</th>
                    <th>Buyer</th>
                    <th className="text-end">Amount</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {realSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <small>{new Date(sale.created_at).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <strong>{sale.prompt?.title || 'Unknown'}</strong>
                      </td>
                      <td>
                        <small className="text-muted">{sale.buyer_email}</small>
                      </td>
                      <td className="text-end">
                        <strong className="text-success">${sale.price_paid.toFixed(2)}</strong>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success">Completed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

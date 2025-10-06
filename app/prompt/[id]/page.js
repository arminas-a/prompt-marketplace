import { supabase } from '../../../lib/supabase'
import BuyButton from '../../../components/BuyButton'

export const revalidate = 0

async function getPrompt(id) {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function PromptDetailPage({ params }) {
  const prompt = await getPrompt(params.id)

  if (!prompt) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Prompt not found</h4>
          <p>This prompt doesn't exist or hasn't been approved yet.</p>
          <a href="/" className="btn btn-primary">Back to Browse</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          <h1 className="mb-3">{prompt.title}</h1>
          
          <div className="mb-3">
            <span className="badge bg-secondary me-2">{prompt.category}</span>
            <span className="badge bg-primary fs-5">${prompt.price}</span>
          </div>

          <p className="lead">{prompt.description}</p>

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div className="card-body">
              <pre className="mb-0" style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>
                {prompt.preview_text}
              </pre>
            </div>
          </div>

          <div className="alert alert-info">
            <h6>What you'll get:</h6>
            <ul className="mb-0">
              <li>Complete prompt sent to your email instantly</li>
              <li>Lifetime access via unique link</li>
              <li>Optimized for professional use</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top" style={{top: '20px'}}>
            <div className="card-body">
              <h4 className="card-title mb-3">${prompt.price}</h4>
              <BuyButton promptId={prompt.id} price={prompt.price} />
              
              <div className="mt-3 text-muted small">
                <p className="mb-1">✓ Instant email delivery</p>
                <p className="mb-1">✓ Secure payment via Stripe</p>
                <p className="mb-0">✓ No subscription required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
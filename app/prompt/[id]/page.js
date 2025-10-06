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
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-lg-8">
          <h1 className="mb-3">{prompt.title}</h1>
          
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <span className="badge bg-secondary fs-6">{prompt.category}</span>
            <span className="badge bg-primary fs-5">${prompt.price}</span>
            {prompt.region_language && (
              <span className="badge bg-info text-dark fs-6">
                📍 {prompt.region_language}
              </span>
            )}
          </div>

          {prompt.optimized_models && prompt.optimized_models.length > 0 && (
            <div className="card mb-4 border-primary">
              <div className="card-body">
                <h6 className="card-title mb-3">
                  <i className="bi bi-robot"></i> Optimized for These AI Models:
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {prompt.optimized_models.map((model, idx) => (
                    <span key={idx} className="badge bg-primary" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
                      {model}
                    </span>
                  ))}
                </div>
                <small className="text-muted d-block mt-2">
                  ✨ This prompt has been specifically tested and optimized for the models listed above
                </small>
              </div>
            </div>
          )}

          <p className="lead">{prompt.description}</p>

          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div className="card-body">
              <pre className="mb-0" style={{
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '0.375rem'
              }}>
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
              <li>Ready to use with {prompt.optimized_models?.join(', ') || 'major AI models'}</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card sticky-top shadow-lg" style={{top: '20px', border: '2px solid #667eea'}}>
            <div className="card-body">
              <h4 className="card-title mb-3 text-center">${prompt.price}</h4>
              <BuyButton promptId={prompt.id} price={prompt.price} />
              
              <div className="mt-3 text-muted small">
                <p className="mb-1">✓ Instant email delivery</p>
                <p className="mb-1">✓ Secure payment via Stripe</p>
                <p className="mb-1">✓ No subscription required</p>
                <p className="mb-0">✓ Lifetime access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
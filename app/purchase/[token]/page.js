import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const revalidate = 0

async function getPurchase(token) {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        prompt:prompts(*)
      `)
      .eq('access_token', token)
      .single()

    if (error) {
      console.error('Purchase fetch error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching purchase:', error)
    return null
  }
}

export default async function PurchasePage({ params }) {
  const purchase = await getPurchase(params.token)

  if (!purchase || !purchase.prompt) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Invalid Link</h4>
          <p>This purchase link is invalid or has expired.</p>
          <a href="/" className="btn btn-primary">Back to Browse</a>
        </div>
      </div>
    )
  }

  const prompt = purchase.prompt

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="alert alert-success">
            <h4>✓ Purchase Confirmed</h4>
            <p className="mb-0">You have lifetime access to this prompt.</p>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{prompt.title}</h3>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">{prompt.description}</p>
              
              <h5>Your Prompt:</h5>
              <div className="bg-light p-4 rounded">
                <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0}}>
{prompt.prompt_text}
                </pre>
              </div>

              <div className="mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(prompt.prompt_text)
                      alert('Copied to clipboard!')
                    }
                  }}
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <h6>📌 Bookmark this page!</h6>
            <p className="mb-0">Save this URL to access your prompt anytime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
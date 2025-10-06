import { supabase } from '../lib/supabase'
import PromptCard from '../components/PromptCard'

export const revalidate = 0 // Don't cache

async function getPrompts() {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching prompts:', error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const prompts = await getPrompts()

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Corporate AI Prompts</h1>
        <p className="lead text-muted">
          Professional prompts for Legal, Compliance, HR, Finance & more.<br/>
          Work less. Be happy more.
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No prompts yet!</h4>
          <p>Be the first to <a href="/sell">sell a prompt</a>.</p>
        </div>
      ) : (
        <div className="row g-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="col-md-6 col-lg-4">
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

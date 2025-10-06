import Link from 'next/link'

export default function PromptCard({ prompt }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title">{prompt.title}</h5>
          <span className="badge bg-primary">${prompt.price}</span>
        </div>
        
        <p className="text-muted small mb-2">
          <span className="badge bg-secondary">{prompt.category}</span>
        </p>
        
        <p className="card-text text-muted small">{prompt.description}</p>
        
        <div className="bg-light p-2 rounded mb-3">
          <small className="text-muted d-block mb-1">Preview:</small>
          <small className="font-monospace" style={{fontSize: '0.75rem'}}>
            {prompt.preview_text.slice(0, 100)}...
          </small>
        </div>
        
        <div className="mt-auto">
          <Link href={`/prompt/${prompt.id}`} className="btn btn-success w-100">
            View Details & Buy
          </Link>
        </div>
      </div>
    </div>
  )
}
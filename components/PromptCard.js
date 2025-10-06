import Link from 'next/link'

export default function PromptCard({ prompt }) {
  return (
    <div 
      className="card h-100 shadow-sm hover-card"
      style={{
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0,0,0,0.125)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
        e.currentTarget.style.borderColor = '#667eea'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.125)'
      }}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title">{prompt.title}</h5>
          <span className="badge bg-primary fs-6">${prompt.price}</span>
        </div>
        
        <div className="mb-2">
          <span className="badge bg-secondary me-1">{prompt.category}</span>
          {prompt.region_language && (
            <span className="badge bg-info text-dark">{prompt.region_language}</span>
          )}
        </div>
        
        <p className="card-text text-muted small flex-grow-1">{prompt.description}</p>
        
        {prompt.optimized_models && prompt.optimized_models.length > 0 && (
          <div className="mb-2">
            <small className="text-muted d-block mb-1">🤖 Optimized for:</small>
            <div className="d-flex flex-wrap gap-1">
              {prompt.optimized_models.slice(0, 3).map((model, idx) => (
                <span key={idx} className="badge bg-light text-dark border" style={{fontSize: '0.7rem'}}>
                  {model}
                </span>
              ))}
              {prompt.optimized_models.length > 3 && (
                <span className="badge bg-light text-dark border" style={{fontSize: '0.7rem'}}>
                  +{prompt.optimized_models.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-light p-2 rounded mb-3">
          <small className="text-muted d-block mb-1">Preview:</small>
          <small className="font-monospace" style={{fontSize: '0.7rem'}}>
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
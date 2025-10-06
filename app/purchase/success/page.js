export default function SuccessPage() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <span style={{fontSize: '80px'}}>✓</span>
              </div>
              <h2 className="mb-3">Payment Successful!</h2>
              <p className="lead mb-4">
                Check your email for the full prompt and access link.
              </p>
              <p className="text-muted mb-4">
                The prompt has been sent to your email. You also received a unique link for lifetime access.
              </p>
              <a href="/" className="btn btn-primary">
                Browse More Prompts
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
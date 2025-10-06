export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#ffffff',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h3 className="fw-bold mb-3" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              PromptHub
            </h3>
            <p className="text-white-50 mb-3">
              Professional AI prompts for the modern workforce.
              Empowering professionals to work smarter, not harder.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 hover-effect">
                <i className="bi bi-twitter" style={{fontSize: '1.5rem'}}></i>
              </a>
              <a href="#" className="text-white-50 hover-effect">
                <i className="bi bi-linkedin" style={{fontSize: '1.5rem'}}></i>
              </a>
              <a href="#" className="text-white-50 hover-effect">
                <i className="bi bi-github" style={{fontSize: '1.5rem'}}></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="text-uppercase mb-3 fw-bold">Marketplace</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-white-50 text-decoration-none hover-link">Browse Prompts</a>
              </li>
              <li className="mb-2">
                <a href="/sell" className="text-white-50 text-decoration-none hover-link">Sell Prompts</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Top Sellers</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">New Releases</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="text-uppercase mb-3 fw-bold">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Legal</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Compliance</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">HR</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Finance</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="text-uppercase mb-3 fw-bold">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Documentation</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">API</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Support</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Blog</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="text-uppercase mb-3 fw-bold">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Terms of Service</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Cookie Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-link">Refund Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-4 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="text-white-50 mb-0">
              © {currentYear} PromptHub. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white-50 mb-0">
              <span className="me-3">🚀 Work less.</span>
              <span>😊 Be happy more.</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-link {
          transition: all 0.3s ease;
        }
        .hover-link:hover {
          color: #667eea !important;
          transform: translateX(5px);
        }
        .hover-effect {
          transition: all 0.3s ease;
        }
        .hover-effect:hover {
          color: #667eea !important;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  )
}

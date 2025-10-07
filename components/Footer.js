export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer style={{
      backgroundColor: 'var(--ft-black)',
      color: 'rgba(255,255,255,0.8)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      marginTop: 'auto',
      padding: '3rem 0 1.5rem 0',
      fontFamily: 'Georgia, serif'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '1rem',
              letterSpacing: '-0.5px'
            }}>
              Prompt Marketplace
            </h5>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.6',
              marginBottom: '1rem',
              fontSize: '0.95rem'
            }}>
              A premium marketplace for professional AI prompts. Curated, verified, and trusted by industry leaders.
            </p>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem'
            }}>Marketplace</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>Browse Prompts</a>
              </li>
              <li className="mb-2">
                <a href="/sell" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>Sell Prompts</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem'
            }}>Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>Legal</a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>Compliance</a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>HR & Finance</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem'
            }}>Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}>Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-4 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <div className="col-12 text-center">
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.875rem',
              marginBottom: 0
            }}>
              © {currentYear} Prompt Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
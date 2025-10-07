export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer style={{
      backgroundColor: '#000',
      color: '#ccc',
      borderTop: '3px solid var(--commando-green)',
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
              color: 'var(--commando-green)',
              marginBottom: '1rem',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              ⚡ Commando
            </h5>
            <p style={{
              color: '#999',
              lineHeight: '1.6',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              Elite AI command center for special operations. Deploy mission-critical commands with precision and power.
            </p>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--commando-highlight)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '1rem'
            }}>Operations</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Command Library</a>
              </li>
              <li className="mb-2">
                <a href="/sell" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Deploy Command</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--commando-highlight)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '1rem'
            }}>Missions</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Black Ops</a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Tactical Support</a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Intel</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--commando-highlight)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '1rem'
            }}>Protocol</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Rules of Engagement</a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link" style={{
                  color: '#999',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.2s'
                }}>Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-4 pt-4" style={{borderTop: '2px solid var(--commando-border)'}}>
          <div className="col-12 text-center">
            <p style={{
              color: '#666',
              fontSize: '0.8rem',
              marginBottom: 0,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              © {currentYear} Commando. Mission Critical Operations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Commando - Elite AI Command Center',
  description: 'Military-grade AI commands for special operations. Command, deploy, execute.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --commando-green: #2D5016;
            --commando-dark: #1a1a1a;
            --commando-grey: #3a3a3a;
            --commando-light-grey: #cccccc;
            --commando-border: #4a4a4a;
            --commando-olive: #4a5d23;
            --commando-highlight: #6b8e23;
          }
          
          body {
            font-family: Georgia, Times New Roman, serif !important;
            color: #e0e0e0 !important;
            background-color: #0a0a0a !important;
            line-height: 1.7 !important;
          }
          
          h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
            font-family: Georgia, Times New Roman, serif !important;
            font-weight: 700 !important;
            color: #f0f0f0 !important;
            line-height: 1.2 !important;
            letter-spacing: -0.5px;
            text-transform: uppercase;
          }
          
          .btn {
            font-family: Georgia, serif !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            border-radius: 0 !important;
            padding: 0.65rem 1.75rem !important;
            transition: all 0.2s !important;
            border-width: 2px !important;
            letter-spacing: 1px;
          }
          
          .btn-primary {
            background-color: var(--commando-green) !important;
            border-color: var(--commando-green) !important;
            color: #fff !important;
          }
          
          .btn-primary:hover {
            background-color: var(--commando-highlight) !important;
            border-color: var(--commando-highlight) !important;
          }
          
          .btn-outline-primary {
            color: var(--commando-green) !important;
            border-color: var(--commando-green) !important;
            background-color: transparent !important;
          }
          
          .btn-outline-primary:hover {
            background-color: var(--commando-green) !important;
            color: #fff !important;
          }
          
          .card {
            border-radius: 0 !important;
            border: 2px solid var(--commando-border) !important;
            background-color: #1a1a1a !important;
            transition: all 0.2s !important;
          }
          
          .card:hover {
            border-color: var(--commando-green) !important;
            box-shadow: 0 4px 12px rgba(45,80,22,0.3) !important;
          }
          
          a {
            color: var(--commando-highlight) !important;
            text-decoration: none !important;
          }
          
          a:hover {
            color: var(--commando-green) !important;
            text-decoration: underline !important;
          }
          
          .form-control, .form-select {
            border-radius: 0 !important;
            border: 2px solid var(--commando-border) !important;
            font-family: Georgia, serif !important;
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: var(--commando-green) !important;
            box-shadow: 0 0 0 3px rgba(45,80,22,0.2) !important;
          }
          
          .badge {
            border-radius: 0 !important;
            font-weight: 600 !important;
            font-family: Georgia, serif !important;
            padding: 0.35em 0.65em !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .nav-link-hover:hover {
            color: var(--commando-highlight) !important;
          }
          
          .btn-signup:hover {
            background-color: var(--commando-highlight) !important;
            border-color: var(--commando-highlight) !important;
          }
          
          .footer-link:hover {
            color: var(--commando-highlight) !important;
          }
          
          .btn-view-details:hover {
            background-color: var(--commando-highlight) !important;
            border-color: var(--commando-highlight) !important;
          }
          
          .prompt-card-hover:hover {
            border-color: var(--commando-green) !important;
            box-shadow: 0 4px 12px rgba(45,80,22,0.3) !important;
          }
        `}} />
      </head>
      <body className="d-flex flex-column min-vh-100">
        <div style={{
          backgroundColor: 'var(--commando-green)',
          borderBottom: '2px solid var(--commando-olive)',
          padding: '0.65rem 0',
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          fontSize: '0.875rem',
          color: '#fff',
          letterSpacing: '1px'
        }}>
          <strong>⚠️ TRAINING MODE</strong> — Test card: <code style={{backgroundColor: '#000', padding: '2px 8px', border: '2px solid var(--commando-olive)', fontFamily: 'monospace', color: '#0f0'}}>4242 4242 4242 4242</code> | Any CVC
        </div>
        <Navbar />
        <main className="flex-grow-1">{children}</main>
        <Footer />
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        />
      </body>
    </html>
  )
}
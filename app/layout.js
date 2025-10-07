import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Prompt Marketplace - Professional AI Solutions',
  description: 'Premium marketplace for verified AI prompts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
        <style>{`
          :root {
            --ft-pink: #FFF1E5;
            --ft-black: #33302E;
            --ft-blue: #0f5499;
            --ft-dark-blue: #0d3d6e;
            --ft-grey: #66605C;
            --ft-light-grey: #E8E6E1;
            --ft-border: #CCC1B7;
          }
          
          body {
            font-family: Georgia, 'Times New Roman', serif !important;
            color: var(--ft-black) !important;
            background-color: #FAFAF9 !important;
            line-height: 1.7 !important;
          }
          
          h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
            font-family: Georgia, 'Times New Roman', serif !important;
            font-weight: 700 !important;
            color: var(--ft-black) !important;
            line-height: 1.2 !important;
            letter-spacing: -0.5px;
          }
          
          .btn {
            font-family: Georgia, serif !important;
            font-weight: 600 !important;
            text-transform: none !important;
            border-radius: 0 !important;
            padding: 0.65rem 1.75rem !important;
            transition: all 0.2s !important;
            border-width: 1px !important;
          }
          
          .btn-primary {
            background-color: var(--ft-black) !important;
            border-color: var(--ft-black) !important;
            color: #fff !important;
          }
          
          .btn-primary:hover {
            background-color: var(--ft-blue) !important;
            border-color: var(--ft-blue) !important;
          }
          
          .btn-outline-primary {
            color: var(--ft-black) !important;
            border-color: var(--ft-black) !important;
          }
          
          .btn-outline-primary:hover {
            background-color: var(--ft-black) !important;
            color: #fff !important;
          }
          
          .card {
            border-radius: 0 !important;
            border: 1px solid var(--ft-border) !important;
            background-color: #fff !important;
            transition: all 0.2s !important;
          }
          
          .card:hover {
            border-color: var(--ft-black) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          }
          
          a {
            color: var(--ft-blue) !important;
            text-decoration: none !important;
          }
          
          a:hover {
            color: var(--ft-dark-blue) !important;
            text-decoration: underline !important;
          }
          
          .form-control, .form-select {
            border-radius: 0 !important;
            border-color: var(--ft-border) !important;
            font-family: Georgia, serif !important;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: var(--ft-black) !important;
            box-shadow: none !important;
          }
          
          .badge {
            border-radius: 0 !important;
            font-weight: 600 !important;
            font-family: Georgia, serif !important;
            padding: 0.35em 0.65em !important;
          }
        `}</style>
      </head>
      <body className="d-flex flex-column min-vh-100">
        <div style={{
          backgroundColor: 'var(--ft-pink)',
          borderBottom: '1px solid var(--ft-border)',
          padding: '0.65rem 0',
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          fontSize: '0.875rem',
          color: 'var(--ft-black)'
        }}>
          <strong>DEMONSTRATION MODE</strong> — Test card: <code style={{backgroundColor: '#fff', padding: '2px 8px', border: '1px solid var(--ft-border)', fontFamily: 'monospace'}}>4242 4242 4242 4242</code> | Any future date & CVC
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
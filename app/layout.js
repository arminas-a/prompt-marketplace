import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'PromptHub - Corporate AI Prompts Marketplace',
  description: 'Buy and sell professional AI prompts for business',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
      </head>
      <body className="d-flex flex-column min-vh-100">
        <div className="alert alert-warning mb-0 text-center py-2 rounded-0 border-0" role="alert">
          <small>
            🧪 <strong>Demo Mode</strong> - Use test card: <code>4242 4242 4242 4242</code> | Any future date | Any CVC
          </small>
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
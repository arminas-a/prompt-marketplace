import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'PromptHub - Corporate AI Prompts Marketplace',
  description: 'Buy and sell professional AI prompts for business',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        />
      </body>
    </html>
  )
}
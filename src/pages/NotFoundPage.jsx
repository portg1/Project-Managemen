import { Link } from 'react-router'

export default function NotFoundPage() {
  return <section className="page"><h1>Page not found</h1><p>The page you requested does not exist.</p><p><Link to="/">Go back home</Link></p></section>
}

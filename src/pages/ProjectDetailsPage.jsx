import { Link, useParams } from 'react-router'

export default function ProjectDetailsPage() {
  const { id } = useParams()
  return <section className="page"><h1>Project {id}</h1><p>This project could not be found.</p><p><Link to="/projects">Back to projects</Link></p></section>
}

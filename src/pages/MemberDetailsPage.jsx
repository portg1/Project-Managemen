import { Link, useParams } from 'react-router'

export default function MemberDetailsPage() {
  const { id } = useParams()
  return <section className="page"><h1>Team member {id}</h1><p>This team member could not be found.</p><p><Link to="/team">Back to team</Link></p></section>
}

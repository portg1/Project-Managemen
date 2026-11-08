import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function MembersCard({ members }) {
  return <Card><CardContent className="p-5"><div className="flex items-center justify-between"><h2 className="text-base font-semibold">Members</h2><span className="text-sm text-muted-foreground">{members.length} total</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{members.map((member) => <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3"><Avatar><AvatarFallback>{member.avatar}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-medium">{member.name}</p><p className="truncate text-xs text-muted-foreground">{member.jobTitle}</p></div></div>)}</div></CardContent></Card>
}

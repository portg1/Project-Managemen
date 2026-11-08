import { BatteryMedium, FolderKanban, ListChecks, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const icons = { FolderKanban, ListChecks, Users, BatteryMedium }

export default function DashboardStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = icons[stat.icon]
        return <Card key={stat.label} className="border-0 shadow-none">
          <CardContent className="p-5">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">{stat.label}</span><Icon className="size-6" /></div>
            <div className="mt-5 flex items-center justify-between"><strong className="text-3xl font-semibold">{stat.value}</strong><span className="flex items-center gap-1 text-sm">{stat.change}<TrendingUp className="size-4" /></span></div>
          </CardContent>
        </Card>
      })}
    </div>
  )
}

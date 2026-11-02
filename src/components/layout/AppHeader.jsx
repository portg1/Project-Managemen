import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import { useLocation } from "react-router"

// Import your theme toggle when implemented.

function getPageTitle(pathname) {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/projects") return "Projects"
  if (pathname.startsWith("/projects/")) return "Project Details"
  if (pathname === "/tasks") return "Tasks"
  if (pathname === "/team") return "Team"
  if (pathname.startsWith("/team/")) return "Member Details"

  return "Not Found"
}

export default function AppHeader() {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger />

      <h1 className="text-lg font-semibold">
        {pageTitle}
      </h1>

    </header>
  )
}
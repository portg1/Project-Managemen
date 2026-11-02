import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

import { NavLink, useLocation } from "react-router"

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
} from "lucide-react"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Team", url: "/team", icon: Users },
]

export default function AppSidebar() {
  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  const isActive = (url) => {
    if (url === "/") {
      return location.pathname === "/"
    }

    return (
      location.pathname === url ||
      location.pathname.startsWith(`${url}/`)
    )
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="px-2 py-3">
          <h2 className="text-lg font-semibold">
            Project Manager
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={
                        <NavLink
                          to={item.url}
                          onClick={() => {
                            if (isMobile) {
                              setOpenMobile(false)
                            }
                          }}
                        />
                      }
                      isActive={isActive(item.url)}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Optional footer content */}
      </SidebarFooter>
    </Sidebar>
  )
}
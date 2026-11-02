import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"

import AppSidebar from "./AppSidebar"
import AppHeader from "./AppHeader"

export default function AppShell({ children }) {
  return (
    <SidebarProvider className="h-svh min-h-0">
      <AppSidebar />

      <SidebarInset className="min-h-0 min-w-0">
        <AppHeader />

        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
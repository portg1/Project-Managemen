import AppRouter from './routes/AppRouter.jsx'
import AppShell from "@/components/layout/AppShell"
import { BrowserRouter } from 'react-router'

import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRouter />
      </AppShell>
      <Toaster />
    </BrowserRouter>
  )
}

export default App

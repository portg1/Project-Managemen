import AppRouter from "./routes/AppRouter.jsx";
import AppShell from "@/components/layout/AppShell";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "next-themes";
import { Card } from "@/components/ui/card";

import { Toaster } from "@/components/ui/sonner";

function App() {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<BrowserRouter>
				<AppShell>
					<AppRouter />
				</AppShell>
				<Toaster />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

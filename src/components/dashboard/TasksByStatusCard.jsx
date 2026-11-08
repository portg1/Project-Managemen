import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export default function TasksByStatusCard({ data }) {
	return (
		<Card className="min-w-0">
			<CardContent className="p-5">
				<h2 className="text-base font-semibold">Tasks by Status</h2>
				<ChartContainer
					config={{ value: { label: "Tasks", color: "#3478df" } }}
					className="mt-4 h-56 w-full"
				>
					<BarChart
						data={data}
						margin={{ top: 20, right: 12, left: -20, bottom: 0 }}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="label"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis allowDecimals={false} tickLine={false} axisLine={false} />
						<Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={52}>
							{data.map((item) => (
								<Cell key={item.label} fill={item.color} />
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

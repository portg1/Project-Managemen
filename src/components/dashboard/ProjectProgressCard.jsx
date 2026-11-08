import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectProgressCard({ data, projectCount }) {
	const completed = data[2]?.value ?? 0;
	return (
		<Card className="min-w-0">
			<CardContent className="p-5">
				<h2 className="text-base font-semibold">Project Progress</h2>
				<div className="mt-4 flex items-center gap-6">
					<div className="relative mx-auto size-44">
						<PieChart width={176} height={176}>
							<Pie
								data={data}
								dataKey="value"
								nameKey="label"
								innerRadius={58}
								outerRadius={78}
								paddingAngle={2}
								stroke="none"
							>
								{data.map((item) => (
									<Cell key={item.label} fill={item.color} />
								))}
							</Pie>
						</PieChart>
						<div className="absolute inset-0 flex items-center justify-center">
							<strong>
								{projectCount
									? Math.round((completed / projectCount) * 100)
									: 0}
								%
							</strong>
						</div>
					</div>
					<div className="space-y-4">
						{data.map((item) => (
							<div
								key={item.label}
								className="flex items-center justify-between gap-6 text-sm"
							>
								<span className="flex items-center gap-2">
									<span
										className="size-2.5 rounded-full"
										style={{ backgroundColor: item.color }}
									/>
									{item.label}
								</span>
								<span>{item.value}</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

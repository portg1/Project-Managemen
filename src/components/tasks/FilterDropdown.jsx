import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
export default function FilterDropdown({
	filters,
	onChange,
	projects,
	members,
}) {
	const set = (key) => (value) =>
		onChange({ ...filters, [key]: value === "all" ? "" : value });
	return (
		<div className="flex flex-wrap gap-2">
			<Select value={filters.status || "all"} onValueChange={set("status")}>
				<SelectTrigger>
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All statuses</SelectItem>
					{[
						["todo", "To Do"],
						["in_progress", "In Progress"],
						["done", "Done"],
					].map(([v, l]) => (
						<SelectItem key={v} value={v}>
							{l}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={filters.priority || "all"} onValueChange={set("priority")}>
				<SelectTrigger>
					<SelectValue placeholder="Priority" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All priorities</SelectItem>
					{["Low", "Medium", "High"].map((v) => (
						<SelectItem key={v} value={v}>
							{v}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={filters.assigneeId || "all"}
				onValueChange={set("assigneeId")}
			>
				<SelectTrigger>
					<SelectValue placeholder="Assignee" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All assignees</SelectItem>
					<SelectItem value="unassigned">Unassigned</SelectItem>
					{members.map((m) => (
						<SelectItem key={m.id} value={m.id}>
							{m.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={filters.projectId || "all"}
				onValueChange={set("projectId")}
			>
				<SelectTrigger>
					<SelectValue placeholder="Project" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All projects</SelectItem>
					{projects.map((p) => (
						<SelectItem key={p.id} value={p.id}>
							{p.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button
				type="button"
				variant="ghost"
				onClick={() =>
					onChange({ status: "", priority: "", assigneeId: "", projectId: "" })
				}
			>
				Reset
			</Button>
		</div>
	);
}

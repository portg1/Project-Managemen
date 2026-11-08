import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	PROJECT_STATUSES,
	SORT_FIELDS,
} from "@/services/projects/projectFilterService.js";

export default function ProjectFilters({
	filters,
	search,
	hasFilters,
	onSearchChange,
	onFilterChange,
	onClear,
}) {
	return (
		<Card>
			<CardContent className="flex flex-col gap-4 p-4">
				<div className="relative">
					<Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
					<Input
						aria-label="Search projects"
						className="pl-8"
						placeholder="Search projects..."
						value={search}
						onChange={onSearchChange}
					/>
				</div>
				<div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
					<Select
						value={filters.status}
						onValueChange={(value) => onFilterChange("status", value)}
					>
						<SelectTrigger
							aria-label="Filter by status"
							className="w-full md:w-40"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(PROJECT_STATUSES).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						type="button"
						variant={filters.overdue ? "default" : "outline"}
						onClick={() => onFilterChange("overdue", !filters.overdue)}
					>
						Overdue
					</Button>
					<Select
						value={filters.sortBy}
						onValueChange={(value) => onFilterChange("sortBy", value)}
					>
						<SelectTrigger
							aria-label="Sort projects by"
							className="w-full md:w-40"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(SORT_FIELDS).map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={filters.sortOrder}
						onValueChange={(value) => onFilterChange("sortOrder", value)}
					>
						<SelectTrigger aria-label="Sort order" className="w-full md:w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="asc">Ascending</SelectItem>
							<SelectItem value="desc">Descending</SelectItem>
						</SelectContent>
					</Select>
					{hasFilters && (
						<Button type="button" variant="ghost" onClick={onClear}>
							Clear filters
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

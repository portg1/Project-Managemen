import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchTasks } from "@/services/tasks/taskSearchService.js";

export default function TaskSearch({ tasks, value, onChange, onResults }) {
	useEffect(() => {
		onResults(searchTasks(tasks, value));
	}, [tasks, value, onResults]);

	const handleChange = (nextValue) => {
		onChange(nextValue);
		onResults(searchTasks(tasks, nextValue));
	};
	return (
		<div className="relative flex-1">
			<label htmlFor="task-search" className="sr-only">
				Search tasks
			</label>
			<Input
				id="task-search"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				placeholder="Search by title or description"
			/>
			{value && (
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="absolute top-0 right-0"
					onClick={() => handleChange("")}
					aria-label="Clear search"
				>
					<X />
				</Button>
			)}
		</div>
	);
}

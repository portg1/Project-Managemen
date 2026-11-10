import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TaskSearch({ value, onChange }) {
	const [draft, setDraft] = useState(value);
	useEffect(() => {
		const timeout = setTimeout(() => onChange(draft), 300);
		return () => clearTimeout(timeout);
	}, [draft, onChange]);

	const handleChange = (nextValue) => {
		setDraft(nextValue);
	};
	return (
		<div className="relative flex-1">
			<label htmlFor="task-search" className="sr-only">
				Search tasks
			</label>
			<Input
				id="task-search"
				value={draft}
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

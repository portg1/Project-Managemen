import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_PROJECT = {
	name: "",
	description: "",
	status: "planned",
	startDate: "",
	dueDate: "",
};

export default function ProjectFormDialog({
	open,
	onOpenChange,
	project,
	onSubmit,
}) {
	const editing = Boolean(project);
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: DEFAULT_PROJECT,
	});

	useEffect(() => {
		if (open)
			reset(project ? { ...DEFAULT_PROJECT, ...project } : DEFAULT_PROJECT);
	}, [open, project, reset]);

	function submit(values) {
		onSubmit({
			...values,
			name: values.name.trim(),
			description: values.description.trim(),
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit project" : "Create project"}
					</DialogTitle>
					<DialogDescription>
						{editing
							? "Update the project details."
							: "Add a project to start tracking its work."}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(submit)} className="grid gap-4">
					<div className="grid gap-1.5">
						<label htmlFor="project-name" className="text-sm font-medium">
							Name
						</label>
						<Input
							id="project-name"
							aria-invalid={Boolean(errors.name)}
							aria-describedby={errors.name ? "project-name-error" : undefined}
							{...register("name", {
								required: "Name is required.",
								validate: (value) =>
									value.trim().length > 0 || "Name is required.",
							})}
						/>
						{errors.name && (
							<p
								id="project-name-error"
								role="alert"
								className="text-sm text-destructive"
							>
								{errors.name.message}
							</p>
						)}
					</div>
					<div className="grid gap-1.5">
						<label
							htmlFor="project-description"
							className="text-sm font-medium"
						>
							Description
						</label>
						<Textarea id="project-description" {...register("description")} />
					</div>
					<div className="grid gap-1.5">
						<label htmlFor="project-status" className="text-sm font-medium">
							Status
						</label>
						<Controller
							name="status"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger id="project-status">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="planned">Planned</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="on_hold">On Hold</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<Controller
							name="startDate"
							control={control}
							render={({ field }) => (
								<DatePicker
									label="Start date"
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="dueDate"
							control={control}
							rules={{
								validate: (dueDate, values) =>
									!dueDate ||
									!values.startDate ||
									dueDate >= values.startDate ||
									"Due date must not precede the start date.",
							}}
							render={({ field }) => (
								<DatePicker
									label="Due date"
									value={field.value}
									onChange={field.onChange}
									error={errors.dueDate?.message}
								/>
							)}
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit">
							{editing ? "Save changes" : "Create project"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

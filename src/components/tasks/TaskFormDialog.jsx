import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
	createTask,
	deleteTask,
	updateTask,
} from "@/services/tasks/taskCrudService.js";
import { useProjectStore } from "@/store/projectStore.js";

const today = () => new Date().toISOString().slice(0, 10);
const defaults = {
	title: "",
	description: "",
	projectId: "",
	assigneeId: "",
	priority: "Medium",
	status: "todo",
	dueDate: "",
};

export default function TaskFormDialog({
	open,
	onOpenChange,
	task = null,
	projectId = null,
	assigneeId = null,
	status = "todo",
}) {
	const projects = useProjectStore((s) => s.projects);
	const members = useProjectStore((s) => s.members);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({ defaultValues: defaults });
	useEffect(() => {
		if (open)
			reset(
				task
					? { ...defaults, ...task, assigneeId: task.assigneeId || "" }
					: {
							...defaults,
							projectId: projectId || "",
							assigneeId: assigneeId || "",
							status,
						},
			);
	}, [open, task, projectId, assigneeId, status, reset]);
	const submit = async (values) => {
		const payload = {
			...values,
			title: values.title.trim(),
			description: values.description || "",
			assigneeId: values.assigneeId || null,
		};
		const ok = task
			? updateTask(task.id, payload)
			: createTask({
					...payload,
					id: crypto.randomUUID(),
					createdAt: new Date().toISOString(),
				});
		if (!ok) {
			toast.error("Could not save task.");
			return;
		}
		toast.success(task ? "Task updated." : "Task created.");
		onOpenChange(false);
	};
	const remove = () => {
		if (!deleteTask(task.id)) return toast.error("Could not delete task.");
		toast.success("Task deleted.");
		setDeleteOpen(false);
		onOpenChange(false);
	};
	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{task ? "Edit task" : "Add task"}</DialogTitle>
						<DialogDescription>
							{task
								? "Update the task details."
								: "Create a task for your project."}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit(submit)} className="grid gap-4">
						<div className="grid gap-1.5">
							<label htmlFor="task-title">Title</label>
							<Input
								id="task-title"
								{...register("title", {
									required: "Title is required",
									validate: (v) => (v.trim() ? true : "Title is required"),
								})}
								aria-invalid={!!errors.title}
							/>
							{errors.title && (
								<p className="text-sm text-destructive">
									{errors.title.message}
								</p>
							)}
						</div>
						<div className="grid gap-1.5">
							<label htmlFor="task-description">Description</label>
							<Textarea id="task-description" {...register("description")} />
						</div>
						<Field label="Project" error={errors.projectId}>
							<Controller
								name="projectId"
								control={control}
								rules={{
									required: "Project is required",
									validate: (v) =>
										projects.some((p) => p.id === v) ||
										"Select a valid project",
								}}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select project" />
										</SelectTrigger>
										<SelectContent>
											{projects.map((p) => (
												<SelectItem key={p.id} value={p.id}>
													{p.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</Field>
						<Field label="Assignee" error={errors.assigneeId}>
							<Controller
								name="assigneeId"
								control={control}
								rules={{
									validate: (v) =>
										!v ||
										members.some((m) => m.id === v) ||
										"Select a valid member",
								}}
								render={({ field }) => (
									<Select
										value={field.value || "unassigned"}
										onValueChange={(v) =>
											field.onChange(v === "unassigned" ? "" : v)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Unassigned" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="unassigned">Unassigned</SelectItem>
											{members.map((m) => (
												<SelectItem key={m.id} value={m.id}>
													{m.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</Field>
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Priority">
								<Controller
									name="priority"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{["Low", "Medium", "High"].map((v) => (
													<SelectItem key={v} value={v}>
														{v}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</Field>
							<Field label="Status">
								<Controller
									name="status"
									control={control}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
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
									)}
								/>
							</Field>
						</div>
						<Controller
							name="dueDate"
							control={control}
							rules={{
								required: "Due date is required",
								validate: (v) =>
									task || !v || v >= today() || "New tasks cannot be overdue",
							}}
							render={({ field, fieldState }) => (
								<DatePicker
									label="Due date"
									{...field}
									error={fieldState.error?.message}
								/>
							)}
						/>
						<DialogFooter>
							<div className="flex w-full justify-between gap-2">
								{task ? (
									<Button
										type="button"
										variant="danger"
										onClick={() => setDeleteOpen(true)}
									>
										<Trash2 /> Delete
									</Button>
								) : (
									<span />
								)}
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => onOpenChange(false)}
									>
										Cancel
									</Button>
									<Button type="submit" loading={isSubmitting}>
										Save task
									</Button>
								</div>
							</div>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			{task && (
				<ConfirmDialog
					open={deleteOpen}
					onOpenChange={setDeleteOpen}
					title={`Delete “${task.title}”?`}
					description="This action cannot be undone."
					confirmLabel="Delete task"
					variant="destructive"
					onConfirm={remove}
				/>
			)}
		</>
	);
}
function Field({ label, error, children }) {
	return (
		<div className="grid gap-1.5">
			<span className="text-sm font-medium">{label}</span>
			{children}
			{error && <p className="text-sm text-destructive">{error.message}</p>}
		</div>
	);
}

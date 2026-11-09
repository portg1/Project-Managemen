import { useState } from "react";
import { Link, useParams } from "react-router";
import TaskCard from "@/components/tasks/TaskCard.jsx";
import TaskFormDialog from "@/components/tasks/TaskFormDialog.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore } from "@/store/projectStore.js";
import { selectMemberById, selectTasksForMember } from "@/store/selectors.js";

export default function MemberDetailsPage() {
	const { id } = useParams();
	const member = useProjectStore((s) => selectMemberById(s, id));
	const tasks = useProjectStore((s) => selectTasksForMember(s, id));
	const projects = useProjectStore((s) => s.projects);
	const [dialog, setDialog] = useState({ open: false, task: null });
	if (!member)
		return (
			<section className="page">
				<h1>Member not found</h1>
				<p>This team member could not be found.</p>
				<Link to="/team">Back to team</Link>
			</section>
		);
	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
			<Link to="/team">← Back to team</Link>
			<Card>
				<CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarFallback>
								{member.avatar || member.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1>{member.name}</h1>
							<p className="text-muted-foreground">
								{member.jobTitle || "Team member"}
							</p>
						</div>
					</div>
					<Button onClick={() => setDialog({ open: true, task: null })}>
						Add task
					</Button>
				</CardContent>
			</Card>
			<div className="grid gap-4 md:grid-cols-2">
				{tasks.map((task) => (
					<TaskCard
						key={task.id}
						task={task}
						project={projects.find((p) => p.id === task.projectId)}
						assignee={member}
						onEdit={(t) => setDialog({ open: true, task: t })}
					/>
				))}
			</div>
			<TaskFormDialog
				open={dialog.open}
				onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
				task={dialog.task}
				assigneeId={member.id}
			/>
		</section>
	);
}

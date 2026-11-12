const PROJECT_STATUSES = ["planned", "active", "on_hold", "completed"];
const TASK_STATUSES = ["todo", "in_progress", "done"];
const PRIORITIES = ["Low", "Medium", "High"];

function dateOffset(days) {
	const date = new Date();
	date.setHours(12, 0, 0, 0);
	date.setDate(date.getDate() + days);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function createdAt(daysAgo, hour = 10) {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	date.setHours(hour, 0, 0, 0);
	return date.toISOString();
}

export const members = [
	{
		id: "member-1",
		name: "Maya Chen",
		jobTitle: "Product Manager",
		avatar: "MC",
	},
	{
		id: "member-2",
		name: "Owen Patel",
		jobTitle: "Frontend Engineer",
		avatar: "OP",
	},
	{
		id: "member-3",
		name: "Sofia Alvarez",
		jobTitle: "UX Designer",
		avatar: "SA",
	},
	{
		id: "member-4",
		name: "Liam Johnson",
		jobTitle: "Backend Engineer",
		avatar: "LJ",
	},
	{
		id: "member-5",
		name: "Nora Williams",
		jobTitle: "QA Engineer",
		avatar: "NW",
	},
	{
		id: "member-6",
		name: "Ethan Brooks",
		jobTitle: "Marketing Specialist",
		avatar: "EB",
	},
];

export const projects = [
	{
		id: "project-1",
		name: "Mobile Banking App",
		description: "A secure mobile experience for everyday banking.",
		status: "planned",
		startDate: dateOffset(3),
		dueDate: dateOffset(45),
		color: "#4f46e5",
		tag: "Mobile",
	},
	{
		id: "project-2",
		name: "Design System Refresh",
		description: "Unify product patterns and accessibility standards.",
		status: "active",
		startDate: dateOffset(-20),
		dueDate: dateOffset(20),
		color: "#0891b2",
		tag: "Design",
	},
	{
		id: "project-3",
		name: "Q3 Marketing Launch",
		description: "Coordinate the launch campaign for the new platform.",
		status: "completed",
		startDate: dateOffset(-70),
		dueDate: dateOffset(-8),
		color: "#16a34a",
		tag: "Marketing",
	},
	{
		id: "project-4",
		name: "Analytics Pipeline",
		description: "Improve event collection and reporting reliability.",
		status: "active",
		startDate: dateOffset(-14),
		dueDate: dateOffset(30),
		color: "#d97706",
		tag: "Engineering",
	},
	{
		id: "project-5",
		name: "Customer Support Portal",
		description:
			"Give customers a faster way to find help and contact support.",
		status: "active",
		startDate: dateOffset(-10),
		dueDate: dateOffset(38),
		color: "#db2777",
		tag: "Web",
	},
];

const task = (
	id,
	title,
	description,
	projectId,
	assigneeId,
	priority,
	status,
	dueOffset,
	createdDaysAgo,
) => ({
	id,
	title,
	description,
	projectId,
	assigneeId,
	priority,
	status,
	dueDate: dateOffset(dueOffset),
	createdAt: createdAt(createdDaysAgo),
});

export const tasks = [
	task(
		"task-1",
		"Map account onboarding flow",
		"Document the main onboarding steps and edge cases.",
		"project-1",
		"member-1",
		"Medium",
		"todo",
		7,
		1,
	),
	task(
		"task-2",
		"Prototype biometric sign-in",
		"Create an interactive prototype for biometric authentication.",
		"project-1",
		"member-3",
		"High",
		"todo",
		14,
		2,
	),
	task(
		"task-3",
		"Define API security requirements",
		"Capture token, session, and audit requirements for engineering.",
		"project-1",
		"member-4",
		"High",
		"todo",
		21,
		3,
	),
	task(
		"task-4",
		"Prepare app store checklist",
		"List release assets and compliance checks for both stores.",
		"project-1",
		"member-6",
		"Low",
		"todo",
		30,
		4,
	),
	task(
		"task-5",
		"Review accessibility baseline",
		"Review accessibility goals before implementation begins.",
		"project-1",
		"member-5",
		"Medium",
		"todo",
		0,
		5,
	),
	task(
		"task-6",
		"Audit existing components",
		"Identify duplicated and inconsistent UI components.",
		"project-2",
		"member-3",
		"High",
		"done",
		-4,
		16,
	),
	task(
		"task-7",
		"Build typography tokens",
		"Add type scale and font tokens to the design library.",
		"project-2",
		"member-2",
		"Medium",
		"done",
		-1,
		12,
	),
	task(
		"task-8",
		"Document component usage",
		"Write guidance for common states and composition patterns.",
		"project-2",
		"member-1",
		"Low",
		"in_progress",
		0,
		6,
	),
	task(
		"task-9",
		"Run contrast review",
		"Check core components against WCAG contrast requirements.",
		"project-2",
		"member-5",
		"High",
		"todo",
		5,
		2,
	),
	task(
		"task-10",
		"Publish campaign landing page",
		"Release the approved launch page and verify analytics.",
		"project-3",
		"member-2",
		"High",
		"done",
		-8,
		70,
	),
	task(
		"task-11",
		"Approve launch messaging",
		"Finalize headline, email, and social copy.",
		"project-3",
		"member-6",
		"Medium",
		"done",
		-10,
		68,
	),
	task(
		"task-12",
		"Send customer announcement",
		"Send the launch announcement to the subscribed audience.",
		"project-3",
		"member-1",
		"High",
		"done",
		-9,
		65,
	),
	task(
		"task-13",
		"Archive campaign assets",
		"Organize final creative assets and campaign notes.",
		"project-3",
		"member-6",
		"Low",
		"done",
		-7,
		60,
	),
	task(
		"task-14",
		"Define event naming scheme",
		"Create a consistent naming convention for tracked events.",
		"project-4",
		"member-4",
		"High",
		"done",
		-2,
		14,
	),
	task(
		"task-15",
		"Implement event validation",
		"Add validation for required analytics event properties.",
		"project-4",
		"member-4",
		"High",
		"done",
		2,
		9,
	),
	task(
		"task-16",
		"Add pipeline retry handling",
		"Retry transient ingestion failures and log final errors.",
		"project-4",
		"member-2",
		"High",
		"in_progress",
		6,
		7,
	),
	task(
		"task-17",
		"Create reporting dashboard",
		"Build a first dashboard for event health and volume.",
		"project-4",
		"member-1",
		"Medium",
		"todo",
		18,
		4,
	),
	task(
		"task-18",
		"Write pipeline runbook",
		"Document deployment, monitoring, and incident recovery steps.",
		"project-4",
		"member-5",
		"Low",
		"todo",
		25,
		3,
	),
	task(
		"task-19",
		"Design help center shell",
		"Create responsive layouts for navigation and article pages.",
		"project-4",
		"member-3",
		"Medium",
		"todo",
		12,
		2,
	),
	task(
		"task-20",
		"Interview support agents",
		"Gather workflow pain points from the support team.",
		"project-5",
		"member-1",
		"Medium",
		"done",
		-3,
		13,
	),
	task(
		"task-21",
		"Set up portal routing",
		"Add route structure for search, articles, and contact forms.",
		"project-5",
		"member-2",
		"High",
		"done",
		1,
		10,
	),
	task(
		"task-22",
		"Build article search",
		"Implement relevance-ranked article search and empty states.",
		"project-5",
		"member-4",
		"High",
		"in_progress",
		4,
		8,
	),
	task(
		"task-23",
		"Add contact form validation",
		"Validate support requests and show useful inline errors.",
		"project-5",
		"member-2",
		"Medium",
		"in_progress",
		9,
		5,
	),
	task(
		"task-24",
		"Usability test portal",
		"Test the primary support journeys with five participants.",
		"project-5",
		"member-5",
		"Medium",
		"todo",
		16,
		3,
	),
	task(
		"task-25",
		"Prepare launch metrics",
		"Define adoption and resolution metrics for the portal launch.",
		"project-5",
		"member-6",
		"Low",
		"todo",
		22,
		1,
	),
];

const subtask = (id, taskId, title, status, createdDaysAgo) => ({
	id,
	taskId,
	title,
	status,
	createdAt: createdAt(createdDaysAgo),
});

export const subtasks = [
	subtask(
		"subtask-1",
		"task-1",
		"List onboarding steps for new customers",
		"done",
		1,
	),
	subtask(
		"subtask-2",
		"task-1",
		"Document edge cases for failed verification",
		"in_progress",
		1,
	),
	subtask(
		"subtask-3",
		"task-2",
		"Sketch biometric sign-in states",
		"done",
		2,
	),
	subtask(
		"subtask-4",
		"task-2",
		"Prototype fallback authentication flow",
		"todo",
		2,
	),
	subtask(
		"subtask-5",
		"task-3",
		"Review token expiration requirements",
		"in_progress",
		3,
	),
	subtask(
		"subtask-6",
		"task-6",
		"Inventory shared form components",
		"done",
		15,
	),
	subtask(
		"subtask-7",
		"task-6",
		"Flag inconsistent button variants",
		"done",
		14,
	),
	subtask(
		"subtask-8",
		"task-8",
		"Draft usage guidance for form fields",
		"in_progress",
		5,
	),
	subtask(
		"subtask-9",
		"task-9",
		"Check primary button contrast",
		"todo",
		2,
	),
	subtask(
		"subtask-10",
		"task-16",
		"Add retry limit configuration",
		"done",
		6,
	),
	subtask(
		"subtask-11",
		"task-16",
		"Log exhausted retry attempts",
		"in_progress",
		5,
	),
	subtask(
		"subtask-12",
		"task-22",
		"Rank article results by relevance",
		"in_progress",
		7,
	),
	subtask(
		"subtask-13",
		"task-22",
		"Design the no-results state",
		"todo",
		6,
	),
	subtask(
		"subtask-14",
		"task-23",
		"Validate required contact fields",
		"done",
		4,
	),
	subtask(
		"subtask-15",
		"task-23",
		"Add inline error messages",
		"in_progress",
		3,
	),
];

export function getProjectProgress(projectId, projectTasks) {
	const relatedTasks = projectTasks.filter(
		(item) => item.projectId === projectId,
	);
	if (relatedTasks.length === 0) return 0;
	const completedTasks = relatedTasks.filter(
		(item) => item.status === "done",
	).length;
	return Math.round((completedTasks / relatedTasks.length) * 100);
}

export function validateData(data = { projects, tasks, members, subtasks }) {
	const unique = (items) =>
		new Set(items.map((item) => item.id)).size === items.length;
	const projectIds = new Set(data.projects.map((project) => project.id));
	const memberIds = new Set(data.members.map((member) => member.id));
	const taskIds = new Set(data.tasks.map((task) => task.id));
	return (
		unique(data.projects) &&
		unique(data.tasks) &&
		unique(data.members) &&
		unique(data.subtasks) &&
		data.tasks.every(
			(item) =>
				projectIds.has(item.projectId) &&
				(item.assigneeId === null || memberIds.has(item.assigneeId)) &&
				TASK_STATUSES.includes(item.status) &&
				PRIORITIES.includes(item.priority),
		) &&
		data.subtasks.every(
			(item) =>
				typeof item.id === "string" &&
				taskIds.has(item.taskId) &&
				typeof item.title === "string" &&
				TASK_STATUSES.includes(item.status) &&
				typeof item.createdAt === "string",
		) &&
		data.projects.every((project) => PROJECT_STATUSES.includes(project.status))
	);
}

export function getInitialData() {
	return structuredClone({ projects, tasks, members, subtasks });
}

if (!validateData()) throw new Error("Invalid seed data");

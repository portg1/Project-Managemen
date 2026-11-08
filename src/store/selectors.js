import { getProjectProgress } from "../data/seedData.js";

export const selectProjectById = (state, projectId) =>
	state.projects.find((project) => project.id === projectId);

export const selectTaskById = (state, taskId) =>
	state.tasks.find((task) => task.id === taskId);

export const selectMemberById = (state, memberId) =>
	state.members.find((member) => member.id === memberId);

export const selectTasksForProject = (state, projectId) =>
	state.tasks.filter((task) => task.projectId === projectId);

export const selectTasksForMember = (state, memberId) =>
	state.tasks.filter((task) => task.assigneeId === memberId);

export const selectProjectProgress = (state, projectId) =>
	getProjectProgress(projectId, state.tasks);

export const selectCompletedTaskCount = (state) =>
	state.tasks.filter((task) => task.status === "done").length;

export const selectInProgressTaskCount = (state) =>
	state.tasks.filter((task) => task.status === "in_progress").length;

export const selectTaskCounts = (state) => ({
	total: state.tasks.length,
	todo: state.tasks.filter((task) => task.status === "todo").length,
	inProgress: selectInProgressTaskCount(state),
	done: selectCompletedTaskCount(state),
});

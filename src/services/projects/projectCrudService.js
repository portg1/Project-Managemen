import { useProjectStore } from "@/store/projectStore.js";

export function createProject(project) {
	return useProjectStore.getState().addProject({
		...project,
		id: crypto.randomUUID(),
		color: "#4f46e5",
		tag: "General",
	});
}

export function updateProject(projectId, changes) {
	return useProjectStore.getState().updateProject(projectId, changes);
}

export function deleteProject(projectId) {
	return useProjectStore.getState().deleteProject(projectId);
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getInitialData } from "../data/seedData.js";
import { createProjectSlice } from "./slices/createProjectSlice.js";
import { createTaskSlice } from "./slices/createTaskSlice.js";
import { isValidStoreState } from "./validation.js";

const STORAGE_KEY = "project-management-store";
const initialData = getInitialData();

export const useProjectStore = create(
	persist(
		(set, get, api) => ({
			...initialData,
			hasHydrated: false,

			setHasHydrated: (hasHydrated) => set({ hasHydrated }),
			...createProjectSlice(set, get, api),
			...createTaskSlice(set, get, api),

			resetData: () => set({ ...getInitialData() }),
		}),
		{
			name: STORAGE_KEY,
			partialize: (state) => ({
				projects: state.projects,
				tasks: state.tasks,
				members: state.members,
			}),
			merge: (persistedState, currentState) => {
				const candidate = { ...currentState, ...persistedState };
				return isValidStoreState(candidate) ? candidate : currentState;
			},
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);

export { STORAGE_KEY };

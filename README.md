# React Assessment Project: Project and Task Management System

## 1. Project Introduction

The goal is to design and implement a web-based project and task management system for teams. Users should be able to manage their projects, track the status of various tasks, review project progress through a dashboard, and view overall activity. 

The final output must be a professional, user-friendly product with correct functionality and a standard coding structure.

## 2. Required Features

### 2.1. Main Dashboard
*   Display the total number of projects, tasks, completed tasks, and in-progress tasks.
*   Display the progress percentage of projects.
*   Display a statistical chart of task statuses.
*   Display upcoming tasks and recent activities.

### 2.2. Projects Management
*   View a list of projects including name, description, status, start date, due date, and progress percentage.
*   Ability to create, edit, and delete a project.
*   View the details page of each project and its related tasks.
*   Ability to search, filter, and sort projects.

### 2.3. Tasks Management
*   Ability to create, edit, and delete tasks.
*   Set title, description, related project, assignee, priority, status, and due date.
*   Define statuses as **To Do**, **In Progress**, and **Done**.
*   Display tasks in a Kanban board format and the ability to move them between columns via `Drag & Drop`.
*   Search and filter tasks based on status, priority, assignee, and due date.
*   Highlight overdue and completed tasks.

### 2.4. Team Members Management
*   Display the list of team members with their name and job title.
*   Ability to assign tasks to team members.
*   View each member's tasks and the number of completed tasks and the remaining ones.

### 2.5. UI/UX (User Interface and User Experience)
*   **Page design:** Dashboard, Projects, Project Details, Task Board, and Team.
*   **Responsive design:** for mobile, tablet, and desktop.
*   Use of appropriate forms for creating and editing information.
*   Display success or error messages after operations and delete confirmations.
*   State management for `Loading`, `Error`, and `Empty State`.
*   Implement Navigation suitable for navigating between pages.
*   Support for Dark Mode as a supplementary feature.

## 3. Technical Requirements
*   Project implementation with **React**.
*   Use of `React Router` with an appropriate strategy for page routing.
*   Design of reusable components and standard folder structure.
*   Proper State management and separation of application logic from UI components.
*   Use of mock data or a public API; developing a custom backend is not required.
*   Store information in `LocalStorage` or another suitable solution so that changes persist after a page refresh.
*   Follow code readability principles, error management, and avoid unnecessary code duplication.
*   Use `Git` and commit changes with meaningful Commit messages.
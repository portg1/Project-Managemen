# Data models

The data layer uses plain JavaScript objects with stable string IDs. The initial
dataset is defined in `seedData.js` and is the canonical source for application
state.

## Project

| Property | Type | Description |
| --- | --- | --- |
| `id` | string | Unique project identifier. |
| `name` | string | Project name. |
| `description` | string | Short description of the project. |
| `status` | string | One of `planned`, `active`, `on_hold`, or `completed`. |
| `startDate` | string | Project start date in `YYYY-MM-DD` format. |
| `dueDate` | string | Project due date in `YYYY-MM-DD` format. |
| `color` | string (optional) | UI accent color. |
| `tag` | string (optional) | Short categorization label. |

## Task

| Property | Type | Description |
| --- | --- | --- |
| `id` | string | Unique task identifier. |
| `title` | string | Concise task title. |
| `description` | string | Details and expected outcome. |
| `projectId` | string | ID of the related project. |
| `assigneeId` | string | ID of the responsible member. |
| `priority` | `Low \| Medium \| High` | Urgency of the task. |
| `status` | `todo \| in_progress \| done` | Current workflow state. |
| `dueDate` | string | Task deadline in `YYYY-MM-DD` format. |
| `createdAt` | string | Creation timestamp in ISO 8601 format. |

## Member

| Property | Type | Description |
| --- | --- | --- |
| `id` | string | Unique member identifier. |
| `name` | string | Member's display name. |
| `jobTitle` | string | Member's role on the team. |
| `avatar` | string | Initials or an avatar URL. |

## Relationships and conventions

- A task belongs to exactly one project through `projectId` and is assigned to
  exactly one member through `assigneeId`. Projects and members do not embed
  copies of their tasks.
- `todo` means work has not started, `in_progress` means work is underway, and
  `done` means the task is complete. Priority is ordered from `Low` to `High`.
- Date-only values are local calendar dates in `YYYY-MM-DD`; timestamps are ISO
  8601 strings. Relative seed dates are recalculated when the module loads so
  overdue, today, and upcoming examples remain useful over time.
- Project progress is derived, never stored: `done` tasks for a project divided
  by all tasks for that project, multiplied by 100 and rounded to an integer.
  Projects with no tasks have 0% progress.
- Project statuses describe the project lifecycle: `planned` has not started,
  `active` is underway, `on_hold` is paused, and `completed` is finished.

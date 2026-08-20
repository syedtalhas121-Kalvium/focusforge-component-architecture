# FocusForge Component Architecture Refactor

## Refactor summary

`DashboardPage.jsx` originally combined all page state, derived task calculations, event handlers, and the complete visual layout in a single monolithic component. The refactor keeps the behavior and inline visual styling unchanged while making the page the state owner and composer. It now contains only state declarations, values derived from state, handlers that update state, and a readable component tree.

## Component responsibilities

| Component | Location | Responsibility | Props |
| --- | --- | --- | --- |
| `DashboardHeader` | `src/components/dashboard/` | Renders the FocusForge brand, greeting, and user avatar for the dashboard header. | None; the header is page-specific and currently has no dynamic data. |
| `StatsRow` | `src/components/dashboard/` | Arranges the four dashboard metrics and passes each metric’s values to `StatCard`. | `totalCount`, `completedCount`, `remainingCount`, and `progressPercent`. |
| `AddTaskInput` | `src/components/dashboard/` | Renders the controlled task input and triggers task creation on button click or Enter. | `value`, `onChange`, and `onAdd`. |
| `TaskFilterBar` | `src/components/dashboard/` | Renders the filter buttons and controlled task search field. | `filter`, `onFilterChange`, `searchQuery`, and `onSearchChange`. |
| `TaskList` | `src/components/dashboard/` | Renders the empty state and maps the currently filtered tasks into task rows. | `tasks`, `onToggleTask`, and `onDeleteTask`. |
| `StatCard` | `src/components/shared/` | Renders a label, value, description, and optional progress bar without knowing which page uses it. | `label`, `value`, `description`, `valueColor`, and optional `progressPercent`. |
| `TaskItem` | `src/components/shared/` | Renders one task row, including status toggle, task metadata, and delete action. | `task`, `onToggle`, and `onDelete`. |

## Folder placement

The five components in `src/components/dashboard/` are specific to the FocusForge dashboard composition and its visual sections. The `StatCard` and `TaskItem` components are in `src/components/shared/` because they receive their data through props and have no knowledge of the dashboard, page state, or task filtering rules. They can be reused by another page without importing dashboard-specific code.

## State and data flow

`DashboardPage` remains the single state owner for the task list, draft task title, selected filter, and search query. It derives the filtered task list and summary counts, then passes the smallest practical prop contract to each child. Children report user actions through callbacks rather than mutating state themselves.

## Larger-scale considerations

If the app were ten times larger, I would first move task operations into a dedicated feature hook or service layer, add stable domain types, and introduce component tests for the shared primitives. I would also consider a feature-level folder that colocates data access, state, and tests with the dashboard while keeping truly generic visual primitives in a shared design-system package. A server-backed task store would require optimistic updates, loading and error states, and a query-cache strategy, but those concerns are intentionally outside this refactor’s scope.

## Deployment

The app is configured for GitHub Pages at:

<https://syedtalhas121-kalvium.github.io/focusforge-component-architecture/>

The GitHub Actions workflow builds the Vite app and publishes the `dist` directory whenever changes land on `main`.

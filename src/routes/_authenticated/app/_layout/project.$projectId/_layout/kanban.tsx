import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/project/$projectId/_layout/kanban",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  return <KanbanBoard projectId={Number(projectId)} />;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/_layout/two")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/layout/two"!</div>;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/settings/_layout/two"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/app/_layout/settings/_layout/two"!</div>;
}

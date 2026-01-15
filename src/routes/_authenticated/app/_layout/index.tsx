import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/app/_layout/"!</div>;
}

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@mantine/core";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <Button>Testing</Button>;
}

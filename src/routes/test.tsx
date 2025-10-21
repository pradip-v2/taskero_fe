import { useConversationSocket } from "@/websockets";
import { Button } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { messages, sendMessage } = useConversationSocket({
    conversationId: 1,
  });
  return (
    <div>
      Hello "/test"!
      <Button
        onClick={() => {
          sendMessage("Hi at" + new Date().toString());
        }}
      >
        Send
      </Button>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}

import {
  useS3PresignedUrlCreate,
  type MessageAttachmentRequest as MessageAttachmentRequestRequest,
} from "@/api";
import { useConversationSocket } from "@/websockets";
import { Button, Paper } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Dropzone } from "@mantine/dropzone";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/app/test-chatting")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    messages,
    sendMessage,
    isLoadingMore,
    loadMore,
    addReaction,
    removeReaction,
    deleteMessage,
  } = useConversationSocket({
    conversationId: 1,
  });
  const { mutateAsync: createS3PreSignedUrl } = useS3PresignedUrlCreate();
  const [fileUploaded, setFileUploaded] =
    useState<MessageAttachmentRequestRequest | null>(null);

  return (
    <div>
      Hello "/test"!
      <Button
        key={JSON.stringify(fileUploaded)}
        onClick={() => {
          sendMessage(
            "Hi at " + new Date().toString(),
            fileUploaded ? [fileUploaded] : []
          );
          setFileUploaded(null);
        }}
      >
        Send
      </Button>
      <Button onClick={() => loadMore(3)} loading={isLoadingMore}>
        {isLoadingMore ? "Loading more..." : "Load More"}
      </Button>
      <Dropzone
        onDrop={async (files) => {
          const file = files[0];
          await createS3PreSignedUrl({
            data: {
              filename: file.name,
              content_type: file.type,
            },
          }).then((res) => {
            fetch(res.file_url, {
              method: "PUT",
              headers: {
                "Content-Type": file.type,
              },
              body: file,
            }).then(() => {
              setFileUploaded({
                file_url: res.file_url,
                key: res.key,
              });
            });
          });
        }}
        style={{ marginTop: 20, marginBottom: 20, minHeight: 150 }}
      >
        <div>Drag files here or click to upload</div>
      </Dropzone>
      {messages.map((_, inx) => (
        <Paper key={messages[inx].id} withBorder mb={10} p={10}>
          <pre>
            {messages[inx].id} {messages[inx].content}
          </pre>
          <pre>{JSON.stringify(messages[inx]?.reactions, null, 2)}</pre>
          <Button onClick={() => addReaction(messages[inx].id, "👍")}>
            Add Reaction
          </Button>
          <Button onClick={() => removeReaction(messages[inx].id, "👍")}>
            Remove Reaction
          </Button>
          <Button onClick={() => deleteMessage(messages[inx].id)}>
            Delete Message
          </Button>
        </Paper>
      ))}
      {/* <pre>
        {JSON.stringify(
          messages.map((_, inx) => messages[messages.length - inx - 1]),
          null,
          2
        )}
      </pre> */}
    </div>
  );
}

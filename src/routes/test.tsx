import { useS3PresignedUrlCreate, type MessageAttachmentRequest } from "@/api";
import { useConversationSocket } from "@/websockets";
import { Button } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { Dropzone } from "@mantine/dropzone";
import { useState } from "react";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { messages, sendMessage } = useConversationSocket({
    conversationId: 1,
  });
  const { mutateAsync: createS3PreSignedUrl } = useS3PresignedUrlCreate();
  const [fileUploaded, setFileUploaded] =
    useState<MessageAttachmentRequest | null>(null);

  return (
    <div>
      Hello "/test"!
      <Button
        onClick={() => {
          sendMessage(
            "Hi at " + new Date().toString(),
            fileUploaded ? [fileUploaded] : []
          );
        }}
      >
        Send
      </Button>
      <Dropzone
        onDrop={async (files) => {
          const file = files[0];
          const res = await createS3PreSignedUrl({
            data: {
              filename: file.name,
              content_type: file.type,
            },
          });

          await fetch(res.file_url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

          setFileUploaded({
            file_url: res.file_url,
            key: res.key,
          });

          console.log("File uploaded successfully");
        }}
        style={{ marginTop: 20, marginBottom: 20, minHeight: 150 }}
      >
        <div>Drag files here or click to upload</div>
      </Dropzone>
      <pre>
        {JSON.stringify(
          messages.map((_, inx) => messages[messages.length - inx - 1]),
          null,
          2
        )}
      </pre>
    </div>
  );
}

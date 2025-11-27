import { useEffect, useRef, useCallback, useState } from "react";
import {
  conversationsMessagesList,
  type Message,
  type MessageAttachmentRequest,
} from "@/api";

type ServerEvent = { type: "chat.history"; messages: Message[] } | Message;

interface UseConversationSocketOptions {
  conversationId: number;
  onMessage?: (msg: Message) => void;
  onHistory?: (messages: Message[]) => void;
}

export function useConversationSocket({
  conversationId,
  onMessage,
  onHistory,
}: UseConversationSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzU4NjIxLCJpYXQiOjE3NjQyNzIyMjEsImp0aSI6IjdkZmQwN2YwNzIwZTQ5YjJiZTA4MTYwZGIwNTZiN2RlIiwidXNlcl9pZCI6IjEifQ.hbPl0H9DkejB5jvcZJzLhNvWuJKcgIkZIGjboIAf0eQ";

  const connect = useCallback(() => {
    const wsUrl = new URL(
      `/ws/chat/${conversationId}/`,
      import.meta.env.VITE_BASE_WS_URL
    );
    if (token) wsUrl.searchParams.set("token", token);

    const socket = new WebSocket(wsUrl.toString());
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as ServerEvent;

      if ("type" in data && data.type === "chat.history") {
        setMessages(data.messages);
        onHistory?.(data.messages);
        return;
      }

      if ("id" in data && "content" in data) {
        setMessages((prev) => [...prev, data]);
        onMessage?.(data);
      }
    };
  }, [conversationId, token, onMessage, onHistory]);

  useEffect(() => {
    connect();
    return () => {
      // socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback(
    (message: string, attachments: MessageAttachmentRequest[] = []) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
        return;
      socketRef.current.send(JSON.stringify({ message, attachments }));
    },
    []
  );

  const loadMore = useCallback(
    (limit: number = 20) => {
      setIsLoadingMore(true);
      conversationsMessagesList(conversationId?.toString(), {
        limit,
        before: messages?.at(0)?.id,
      })
        .then((res) => {
          setMessages((prev) => [...res.results, ...prev]);
        })
        .finally(() => setIsLoadingMore(false));
    },
    [conversationId, messages]
  );

  return {
    sendMessage,
    isConnected,
    messages,
    loadMore,
    isLoadingMore,
  };
}

import { useEffect, useRef, useCallback, useState } from "react";
import type { Message } from "@/api";

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

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYxMTUyMDI4LCJpYXQiOjE3NjEwNjU2MjgsImp0aSI6IjUyZWRjOGYyNTYyOTQyZjViYjYyMWZjZmY4YjJjODRmIiwidXNlcl9pZCI6IjEifQ.p8f4UAyzCMOGkMdfVw2mBTHktYRdjm0gzEZz4MISDG8";

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
      socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(JSON.stringify({ message }));
  }, []);

  return {
    sendMessage,
    isConnected,
    messages,
  };
}

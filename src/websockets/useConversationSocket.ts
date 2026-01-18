import { useEffect, useRef, useCallback, useState } from "react";
import {
  conversationsMessagesList,
  type JWT as LoginResponse,
  type Message,
  type MessageAttachmentRequest as MessageAttachmentRequestRequest,
} from "@/api";
import { LOCAL_STORAGE_USER_KEY } from "@/auth";

type MessageIdString = `${number}`;

type ChatHistoryEvent = {
  type: "chat.history";
  messages: Message[];
};

type MessageReactionsEvent = {
  type: "message.reactions";
  message_id: number;
  reactions: Record<string, { [user_id: MessageIdString]: true }>;
};

type MessageDeletedEvent = {
  type: "chat.message_deleted";
  message_id: number;
};

type ServerEvent =
  | ChatHistoryEvent
  | MessageReactionsEvent
  | MessageDeletedEvent
  | Message;

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

  const userObj: LoginResponse | null = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_USER_KEY) ?? "{}"
  );
  // if (userObj?.access) {
  //   config.headers.Authorization = "Bearer " + userObj?.access;
  // }
  const token = userObj?.access;

  const connect = useCallback(() => {
    const wsUrl = new URL(
      `/chat/${conversationId}/`,
      import.meta.env.VITE_BASE_WS_URL
    );
    if (token) wsUrl.searchParams.set("token", token);
    wsUrl.searchParams.set(
      "tenant",
      window.location.hostname?.split(".")?.at(0) || "test"
    );

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
      if ("type" in data && data.type === "message.reactions") {
        setMessages((prev) => {
          return prev.map((m) => {
            if (m.id == data.message_id) {
              return { ...m, reactions: data.reactions };
            }
            return m;
          });
        });
        return;
      }

      if ("type" in data && data.type === "chat.message_deleted") {
        setMessages((prev) => prev.filter((m) => m.id !== data.message_id));
        return;
      }

      if ("id" in data && "content" in data) {
        // if message not found in current messages, add it
        if (!messages.find((m) => m.id === data.id))
          setMessages((prev) => [data, ...prev]);
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
    (message: string, attachments: MessageAttachmentRequestRequest[] = []) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
        return;
      socketRef.current.send(
        JSON.stringify({ type: "message.create_message", message, attachments })
      );
    },
    []
  );

  const addReaction = useCallback((message_id: number, reaction: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(
      JSON.stringify({ type: "message.add_reaction", message_id, reaction })
    );
  }, []);

  const removeReaction = useCallback((message_id: number, reaction: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(
      JSON.stringify({ type: "message.remove_reaction", message_id, reaction })
    );
  }, []);

  const deleteMessage = useCallback((message_id: number) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(
      JSON.stringify({ type: "message.delete_message", message_id })
    );
  }, []);

  const loadMore = useCallback(
    (limit: number = 20) => {
      setIsLoadingMore(true);
      conversationsMessagesList(conversationId?.toString(), {
        limit,
        before: messages?.at(messages.length - 1)?.id,
      })
        .then((res) => {
          setMessages((prev) => [...prev, ...res.results]);
        })
        .finally(() => setIsLoadingMore(false));
    },
    [conversationId, messages]
  );

  return {
    sendMessage,
    addReaction,
    removeReaction,
    deleteMessage,
    isConnected,
    messages,
    loadMore,
    isLoadingMore,
  };
}

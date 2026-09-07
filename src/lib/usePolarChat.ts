import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "cryosphere-chat-v1";
const CHAT_ID = "cryosphere-guide";

export const GREETING: UIMessage = {
  id: "greeting",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi! I'm the CryoSphere Guide. Ask me about sea ice, ice sheets, permafrost, polar ecosystems, field stations or how to cite polar data.",
    },
  ],
};

function readStored(): UIMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UIMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

/** One ongoing conversation with the polar guide, remembered in this browser. */
export function usePolarChat() {
  const chat = useChat({
    id: CHAT_ID,
    messages: [GREETING],
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const { messages, setMessages, status } = chat;
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = readStored();
    if (stored) setMessages(stored);
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated.current || typeof window === "undefined") return;
    if (status === "streaming" || status === "submitted") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage unavailable */
    }
  }, [messages, status]);

  const clear = () => {
    setMessages([GREETING]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  return { ...chat, clear };
}

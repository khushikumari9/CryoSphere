import { MessageSquare, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logo from "@/assets/logo-cryos.png";
import { messageText, usePolarChat } from "@/lib/usePolarChat";

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, clear } = usePolarChat();
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, status]);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open, busy]);

  return (
    <>
      {open && (
        <div className="glass-strong shimmer-border fixed bottom-24 right-4 z-[90] flex h-[min(560px,72vh)] w-[min(380px,92vw)] flex-col overflow-hidden rounded-3xl sm:right-6">
          <header className="flex items-center gap-3 border-b border-border/60 p-4">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">CryoSphere Guide</p>
              <p className="text-xs text-accent">Online · polar science assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={clear}
                aria-label="Start a new conversation"
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m) => {
              const text = messageText(m);
              if (!text) return null;
              return (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                  <p
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                        : "max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                    }
                  >
                    {text}
                  </p>
                </div>
              );
            })}
            {busy && <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border/60 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              const text = input.trim();
              if (!text || busy) return;
              void sendMessage({ text });
              setInput("");
            }}
          >
            <input
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about polar science…"
              className="min-w-0 flex-1 rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send message"
              className="bg-brand grid h-10 w-10 shrink-0 place-items-center rounded-xl text-primary-foreground disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide AI assistant" : "Open AI assistant"}
        className="glass glow animate-float fixed bottom-6 right-4 z-[90] flex items-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-foreground transition-transform hover:scale-105 sm:right-6"
      >
        <MessageSquare className="h-5 w-5 text-accent" />
        Ask the guide
      </button>
    </>
  );
}

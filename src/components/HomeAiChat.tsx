import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { messageText, usePolarChat } from "@/lib/usePolarChat";

export function HomeAiChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = usePolarChat();
  const scroller = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, status]);

  return (
    <section className="mx-auto w-[min(1200px,94vw)] py-8">
      <div className="glass shimmer-border mx-auto max-w-xl overflow-hidden rounded-3xl">
        <header className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <p className="text-sm font-semibold">Quick ask — CryoSphere guide</p>
        </header>
        <div ref={scroller} className="max-h-56 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => {
            const text = messageText(m);
            if (!text) return null;
            return (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a quick question…"
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
    </section>
  );
}

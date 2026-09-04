import { MessageSquare, Send, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-cryos.png";

type Msg = { role: "user" | "assistant"; text: string };

const canned =
  "I'm the CryoSphere guide placeholder. Drop your AI platform's embed code into this widget (Insert → Embed on this page) and I'll answer with your live assistant.";

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hello! Ask me about polar datasets, expedition media, or how to cite CryoSphere material.",
    },
  ]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: canned }]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div className="glass-strong shimmer-border fixed bottom-24 right-4 z-[90] flex h-[min(560px,72vh)] w-[min(380px,92vw)] flex-col overflow-hidden rounded-3xl sm:right-6">
          <header className="flex items-center gap-3 border-b border-border/60 p-4">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">CryoSphere Guide</p>
              <p className="text-xs text-accent">Online · media dissemination assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[92%] text-sm leading-relaxed text-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border/60 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about polar media…"
              className="min-w-0 flex-1 rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="bg-brand grid h-10 w-10 shrink-0 place-items-center rounded-xl text-primary-foreground"
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

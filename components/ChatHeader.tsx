interface ChatHeaderProps {
  tokenUsage?: string;
  provider?: string;
}

export function ChatHeader({ tokenUsage, provider }: ChatHeaderProps) {
  return (
    <header className="flex flex-col gap-2 rounded-3xl bg-surface/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">NovaChat</h1>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
          {provider === "openai" ? "OpenAI" : "Local Reasoner"}
        </span>
      </div>
      <p className="text-sm text-white/70">
        Conversational AI companion tuned for structured thinking, ideation, and quick strategy sessions.
      </p>
      {tokenUsage ? (
        <p className="text-xs text-white/50">{tokenUsage}</p>
      ) : null}
    </header>
  );
}

import clsx from "classnames";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

const roleMap: Record<ChatMessage["role"], string> = {
  user: "You",
  assistant: "Nova",
  system: "System"
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx("flex w-full gap-3", {
        "justify-end": isUser,
        "justify-start": !isUser
      })}
    >
      <div
        className={clsx(
          "max-w-2xl rounded-2xl px-4 py-3 text-sm shadow-lg transition-all",
          {
            "bg-accent/90 text-white": isUser,
            "bg-surface text-slate-100": !isUser
          }
        )}
      >
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest opacity-70">
          {roleMap[message.role] ?? "Assistant"}
        </div>
        <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
        <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] opacity-40">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>
    </div>
  );
}

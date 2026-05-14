import type { Message } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

export function MessageBubble({ message }: { message: Message }) {
  const own = message.senderType === "ai" || message.senderType === "human";
  return (
    <div className={cn("flex", own ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[78%] rounded-lg px-3 py-2 text-sm", own ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
        <p>{message.content}</p>
        <p className={cn("mt-1 text-[11px]", own ? "text-primary-foreground/75" : "text-muted-foreground")}>{message.senderType} · {formatDateTime(message.createdAt)}</p>
      </div>
    </div>
  );
}

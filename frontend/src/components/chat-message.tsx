import type { Message } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
  icon?: string
}

export default function ChatMessage({ message, icon = "📚" }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">{icon}</div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">👤</div>
      )}
    </div>
  )
}

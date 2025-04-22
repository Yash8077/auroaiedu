"use client"

import type React from "react"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChatListProps {
  onClose?: () => void
}

export default function ChatList({ onClose }: ChatListProps) {
  const { chats, activeChat, setActiveChat, deleteChat } = useStore()

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId)
  
    // Close the sidebar only on mobile devices
    if (onClose && window.innerWidth < 768) {
      onClose()
    }
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleChatClick(chat.id)}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group ${
            chat.id === activeChat ? "bg-primary/10 dark:bg-primary/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="text-2xl">{chat.icon || "📚"}</div>
            <div className="overflow-hidden">
              <h3 className="font-medium truncate">{chat.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => handleDeleteChat(e, chat.id)}
            className="opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {chats.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">No chats yet. Start a new conversation!</div>
      )}
    </div>
  )
}

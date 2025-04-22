"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, User } from "lucide-react"

interface MobileNavbarProps {
  onChatClick: () => void
  onNewChatClick: () => void
  onProfileClick: () => void
}

export default function MobileNavbar({ onChatClick, onNewChatClick, onProfileClick }: MobileNavbarProps) {
  return (
    <div className="flex items-center justify-around p-3 border-t bg-background dark:bg-gray-900">
      <Button variant="ghost" size="icon" onClick={onChatClick}>
        <MessageSquare className="h-6 w-6" />
      </Button>

      <Button onClick={onNewChatClick} size="icon" className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-700">
        <Plus className="h-6 w-6" />
      </Button>

      <Button variant="ghost" size="icon" onClick={onProfileClick}>
        <User className="h-6 w-6" />
      </Button>
    </div>
  )
}

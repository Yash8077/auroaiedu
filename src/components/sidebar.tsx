"use client"

// Add theme toggle to the sidebar
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, X } from "lucide-react"
import ChatList from "./chat-list"

interface SidebarProps {
  onClose: () => void
  onNewChat: () => void
}

export default function Sidebar({ onClose, onNewChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure theme is accessed only on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent rendering until mounted
  }

  return (
    <div className="w-80 h-full bg-background border-r flex flex-col z-10">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-bold">EduChat AI</h1>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start space-x-2 bg-blue-700 hover:bg-blue-700/90 text-white cursor-pointer">
          <Plus className="h-5 w-5" />
          <span>New Chat</span>
        </Button>
      </div>



      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">Recent Chats</h2>
        <ChatList onClose={onClose} />
      </div>

      <div className="p-4 border-t">
        {/* Theme toggle added to sidebar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Theme</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">👤</div>
          <div>
            <p className="font-medium">Student User</p>
            <p className="text-xs text-muted-foreground">student@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

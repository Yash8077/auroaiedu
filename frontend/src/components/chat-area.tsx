"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useStore, SUBJECTS } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Send, Loader2 } from "lucide-react"
import ChatMessage from "@/components/chat-message"

interface ChatAreaProps {
  onMenuClick: () => void
  isDesktop: boolean
}

export default function ChatArea({ onMenuClick, isDesktop }: ChatAreaProps) {
  const [input, setInput] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [status, setStatus] = useState("Disconnected") // New state for status
  const socket = useRef<WebSocket | null>(null)

  const { activeChat, chats, addMessage, isTyping, setIsTyping } = useStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeMessages = activeChat ? chats.find((chat) => chat.id === activeChat)?.messages || [] : []
  const activeTitle = activeChat ? chats.find((chat) => chat.id === activeChat)?.title || "Chat" : "Chat"
  const activeIcon = activeChat ? chats.find((chat) => chat.id === activeChat)?.icon || "📚" : "📚"
  const activeSubject = activeChat ? chats.find((chat) => chat.id === activeChat)?.subject || "general" : "general"

  // Setup WebSocket connection
  useEffect(() => {
    if (socket.current) socket.current.close()

    setIsConnecting(true)
    setConnectionError(null)
    setStatus("Connecting...") // Set status when connecting

    const ws = new WebSocket("wss://auroaiedu.onrender.com")
    socket.current = ws

    ws.onopen = () => {
      setIsConnecting(false)
      setIsConnected(true)
      setStatus("Connected") // Set status when connected
      setConnectionError("")
      console.log("✅ WebSocket connected")
    }

    ws.onclose = () => {
      setIsConnecting(false)
      setIsConnected(false)
      setStatus("Disconnected") // Set status when disconnected
      console.log("❌ WebSocket disconnected")
    }

    ws.onerror = (e) => {
      setIsConnecting(false)
      setIsConnected(false)
      setConnectionError("WebSocket connection error. Please try again.")
      setStatus("Connection Error") // Set status on error
      console.warn("⚠️ WebSocket connection error", e)
    }

    ws.onmessage = (event) => {
      const { message } = JSON.parse(event.data)
      if (activeChat) {
        addMessage(activeChat, message, "assistant")
        setIsTyping(false)
      }
    }

    return () => {
      ws.close()
    }
  }, [activeChat])

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeMessages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [activeChat])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !activeChat || !isConnected) return

    addMessage(activeChat, input, "user")
    setInput("")
    setIsTyping(true)

    const payload = {
      message: input,
      subject: activeSubject,
    }

    socket.current?.send(JSON.stringify(payload))
  }

  const handleReconnect = () => {
    setConnectionError(null)
    setIsConnecting(true)
    setStatus("Reconnecting...") // Set status when reconnecting
    const ws = new WebSocket("wss://auroaiedu.onrender.com")
    socket.current = ws
    ws.onopen = () => {
      setIsConnecting(false)
      setIsConnected(true)
      setStatus("Connected") // Set status when reconnected
      setConnectionError("")
      console.log("✅ WebSocket reconnected")
    }
    ws.onerror = () => {
      setIsConnecting(false)
      setIsConnected(false)
      setStatus("Reconnection Failed") // Set status if reconnection fails
    }
  }
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b">
        {!isDesktop && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center">
          <span className="text-2xl mr-2">{activeIcon}</span>
          <div>
            <h2 className="text-xl font-semibold">{activeTitle}</h2>
            <p className="text-xs text-muted-foreground">
              {SUBJECTS.find((s) => s.value === activeSubject)?.label || "General"}
            </p>
          </div>
        </div>
      </div>

      {/* WebSocket Connection Status */}
      <div className="text-center text-xs p-2">
        {connectionError && <span className="text-red-500">{connectionError}</span>}
        {isConnecting && <span className="text-yellow-500">{status}</span>}
        {!isConnected && !isConnecting && !connectionError && (
          <span className="text-gray-500">{status}</span>
        )}
        {isConnected && <span className="text-green-500">{status}</span>}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {activeMessages.map((message) => (
          <ChatMessage key={message.id} message={message} icon={activeIcon} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              {activeIcon}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={!isConnected || isTyping}
          />
          <Button type="submit" disabled={!input.trim() || isTyping || !isConnected}>
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        {!isConnected && !isConnecting && !connectionError && (
          <Button onClick={handleReconnect} variant="outline" className="mt-2">
            Reconnect WebSocket
          </Button>
        )}
      </div>
    </div>
  )
}

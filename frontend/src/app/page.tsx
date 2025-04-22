"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import ChatArea from "@/components/chat-area"
import MobileNavbar from "@/components/mobile-navbar"
import Sidebar from "@/components/sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"
import NewChatDialog from "@/components/new-chat-dialog"
import UserProfile from "@/components/user-profile"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { activeChat, chats } = useStore()

  // Hide sidebar on mobile by default
  useEffect(() => {
    if (!isDesktop) {
      setShowSidebar(false)
    } else {
      setShowSidebar(true)
    }
  }, [isDesktop])

  return (
    <ThemeProvider>
      <main className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar for desktop */}
        {isDesktop && showSidebar && (
          <Sidebar onClose={() => setShowSidebar(false)} onNewChat={() => setShowNewChatDialog(true)} />
        )}

        {/* Mobile sidebar (when open) */}
        {!isDesktop && showSidebar && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0" onClick={() => setShowSidebar(false)} />
            <Sidebar onClose={() => setShowSidebar(false)} onNewChat={() => setShowNewChatDialog(true)} />
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 overflow-hidden">
            {activeChat && chats.find((chat) => chat.id === activeChat) ? (
              <ChatArea onMenuClick={() => setShowSidebar(true)} isDesktop={isDesktop} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Welcome to EduChat AI</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Select a chat or start a new conversation</p>
                  <button
                    onClick={() => setShowNewChatDialog(true)}
                    className="px-4 py-2 bg-blue-700 text-white rounded-md"
                  >
                    Start New Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile navbar */}
          {!isDesktop && (
            <MobileNavbar
              onChatClick={() => setShowSidebar(true)}
              onNewChatClick={() => setShowNewChatDialog(true)}
              onProfileClick={() => setShowUserProfile(true)}
            />
          )}
        </div>

        {/* Dialogs */}
        <NewChatDialog open={showNewChatDialog} onClose={() => setShowNewChatDialog(false)} />

        <UserProfile open={showUserProfile} onClose={() => setShowUserProfile(false)} />
      </main>
    </ThemeProvider>
  )
}

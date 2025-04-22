"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"

interface UserProfileProps {
  open: boolean
  onClose: () => void
}

export default function UserProfile({ open, onClose }: UserProfileProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-3xl mb-2">
              👤
            </div>
            <h3 className="text-lg font-medium">Student User</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">student@example.com</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Theme</span>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            <Button variant="outline" className="w-full justify-start space-x-2 text-red-500 dark:text-red-400">
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

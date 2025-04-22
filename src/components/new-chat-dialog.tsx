"use client"

import type React from "react"

import { useState } from "react"
import { useStore, SUBJECTS } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface NewChatDialogProps {
  open: boolean
  onClose: () => void
}

export default function NewChatDialog({ open, onClose }: NewChatDialogProps) {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("general")
  const { createChat } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    createChat(title, subject)
    setTitle("")
    setSubject("general") // Reset to default
    onClose()
  }

  const handleClose = () => {
    setTitle("")
    setSubject("general") // Reset to default
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose} > 
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Topic Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Quantum Physics, World History"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      <div className="flex items-center">
                        <span className="mr-2">{subject.icon}</span>
                        <span>{subject.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

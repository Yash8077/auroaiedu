import { create } from "zustand"
import { persist } from "zustand/middleware"
import { produce } from "immer"

export type MessageRole = "user" | "assistant" | "system"

export interface Message {
  id: string
  content: string
  role: MessageRole
  createdAt: Date
}

export interface Chat {
  id: string
  title: string
  subject: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  icon?: string
}

export const SUBJECTS = [
  { value: "general", label: "General", icon: "🧠" },
  { value: "physics", label: "Physics", icon: "🔭" },
  { value: "math", label: "Mathematics", icon: "🧮" },
  { value: "history", label: "History", icon: "🏛️" },
  { value: "literature", label: "Literature", icon: "📚" },
  { value: "biology", label: "Biology", icon: "🧬" },
  { value: "chemistry", label: "Chemistry", icon: "⚗️" },
  { value: "computer-science", label: "Computer Science", icon: "💻" },
  { value: "geography", label: "Geography", icon: "🌍" },
  { value: "art", label: "Art", icon: "🎨" },
  { value: "music", label: "Music", icon: "🎵" },
]

interface ChatState {
  chats: Chat[]
  activeChat: string | null
  isTyping: boolean
  setActiveChat: (chatId: string) => void
  createChat: (title: string, subject: string) => string
  addMessage: (chatId: string, content: string, role: MessageRole) => void
  deleteChat: (chatId: string) => void
  setIsTyping: (isTyping: boolean) => void
}

export const useStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChat: null,
      isTyping: false,
      setActiveChat: (chatId) => set({ activeChat: chatId }),
      createChat: (title, subject) => {
        const id = Date.now().toString()
        const subjectInfo = SUBJECTS.find((s) => s.value === subject) || SUBJECTS[0] // Default to general if not found

        const newChat: Chat = {
          id,
          title,
          subject,
          messages: [
            {
              id: "1",
              content: `Welcome to ${title}! How can I help you learn about ${subjectInfo.label}?`,
              role: "assistant",
              createdAt: new Date(),
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          icon: subjectInfo.icon,
        }

        set(
          produce((state: ChatState) => {
            state.chats.unshift(newChat)
            state.activeChat = id
          }),
        )

        return id
      },
      addMessage: (chatId, content, role) => {
        set(
          produce((state: ChatState) => {
            const chat = state.chats.find((c) => c.id === chatId)
            if (!chat) return

            chat.messages.push({
              id: Date.now().toString(),
              content,
              role,
              createdAt: new Date(),
            })

            chat.updatedAt = new Date()
          }),
        )
      },
      deleteChat: (chatId) => {
        set(
          produce((state: ChatState) => {
            state.chats = state.chats.filter((c) => c.id !== chatId)
            if (state.activeChat === chatId) {
              state.activeChat = state.chats.length > 0 ? state.chats[0].id : null
            }
          }),
        )
      },
      setIsTyping: (isTyping) => set({ isTyping }),
    }),
    {
      name: "educational-chats",
      // Use localStorage for persistence
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const { state } = JSON.parse(str)

          // Convert string dates back to Date objects
          if (state.chats) {
            state.chats = state.chats.map((chat: Chat) => ({
              ...chat,
              createdAt: new Date(chat.createdAt),
              updatedAt: new Date(chat.updatedAt),
              messages: chat.messages.map((msg: Message) => ({
                ...msg,
                createdAt: new Date(msg.createdAt),
              })),
            }))
          }

          return { state }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)

// Mock AI responses based on user input and subject
export const generateAIResponse = (message: string, subject: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(
      () => {
        const topics = {
          general: [
            "That's a great question! Let me provide a general overview of this topic.",
            "This is an interesting area to explore. Here's what you should know about it.",
            "I'd be happy to explain this concept in a way that's easy to understand.",
          ],
          physics: [
            "In physics, energy cannot be created or destroyed, only transformed from one form to another.",
            "Newton's third law states that for every action, there is an equal and opposite reaction.",
            "The theory of relativity changed our understanding of space and time.",
          ],
          math: [
            "The Fibonacci sequence appears throughout nature, from flower petals to spiral galaxies.",
            "Calculus is the mathematical study of continuous change.",
            "Prime numbers are the building blocks of all integers.",
          ],
          history: [
            "The Renaissance period marked a cultural rebirth in Europe between the 14th and 17th centuries.",
            "The Industrial Revolution transformed manufacturing processes in the late 18th century.",
            "Ancient civilizations like Egypt, Greece, and Rome laid the foundations for modern society.",
          ],
          literature: [
            "Shakespeare wrote 37 plays and 154 sonnets during his lifetime.",
            "The novel as a literary form emerged in the early 18th century.",
            "Magical realism blends realistic elements with magical or fantastical ones.",
          ],
          biology: [
            "DNA contains the genetic instructions for the development and functioning of all living organisms.",
            "The cell is the basic structural and functional unit of all organisms.",
            "Evolution by natural selection is the process by which organisms change over time.",
          ],
          chemistry: [
            "The periodic table organizes elements based on their atomic number and chemical properties.",
            "Chemical bonds form when atoms share or transfer electrons.",
            "Acids donate protons while bases accept them in chemical reactions.",
          ],
          "computer-science": [
            "Algorithms are step-by-step procedures for solving problems or accomplishing tasks.",
            "Data structures organize and store data in ways that enable efficient access and modification.",
            "Object-oriented programming is based on the concept of objects containing data and code.",
          ],
          geography: [
            "Plate tectonics explains the movement of the Earth's lithosphere.",
            "Climate is the average weather conditions in a place over a long period.",
            "Human geography studies how humans interact with and shape their environment.",
          ],
          art: [
            "The Renaissance period saw a revival of classical learning and values in art.",
            "Impressionism focused on capturing light and color in the moment.",
            "Abstract art uses shapes, colors, and forms to create non-representational works.",
          ],
          music: [
            "The basic elements of music include rhythm, melody, harmony, and timbre.",
            "Classical music evolved through the Baroque, Classical, and Romantic periods.",
            "Jazz originated in the African American communities of New Orleans in the late 19th century.",
          ],
          default: [
            "That's an interesting question! Let me explain this concept in more detail.",
            "Great question! This topic has several important aspects to consider.",
            "I'd be happy to help you understand this better. Let's break it down.",
          ],
        }

        // Get responses for the specific subject or default to general responses
        const responseArray = topics[subject as keyof typeof topics] || topics.default

        // Add some context from the user's message
        const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)]
        const contextualResponse = `${randomResponse} ${generateContextualResponse(message, subject)}`

        resolve(contextualResponse)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  })
}

const generateContextualResponse = (message: string, subject: string): string => {
  const words = message.split(" ")
  const significantWords = words.filter((word) => word.length > 4).map((word) => word.toLowerCase())

  if (significantWords.length === 0) return ""

  const randomWord = significantWords[Math.floor(Math.random() * significantWords.length)]

  const contextResponses = [
    `Your question about "${randomWord}" touches on a fundamental concept in ${subject}.`,
    `When we consider "${randomWord}" in ${subject}, we need to examine multiple perspectives.`,
    `The idea of "${randomWord}" has evolved significantly over time in academic understanding of ${subject}.`,
    `Many students find "${randomWord}" challenging at first, but it becomes clearer with practice.`,
  ]

  return contextResponses[Math.floor(Math.random() * contextResponses.length)]
}

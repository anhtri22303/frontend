"use client"

import { useState } from "react"
import { X, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  const toggleChatBox = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message])
      setMessage("")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-primary text-white">
            <h3 className="text-lg font-semibold">Chat with us</h3>
            <Button variant="ghost" size="icon" onClick={toggleChatBox}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <div className="bg-gray-200 p-2 rounded-lg">{msg}</div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      ) : (
        <Button variant="primary" size="icon" className="rounded-full p-3" onClick={toggleChatBox}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User } from "lucide-react"
import { mockApi, Agent, ChatMessage } from "@/services/mockApi"

interface ChatInterfaceProps {
  agent: Agent
  onClose: () => void
}

export function ChatInterface({ agent, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [agent.id])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const loadMessages = async () => {
    try {
      const chatMessages = await mockApi.getChatMessages(agent.id)
      setMessages(chatMessages)
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    const messageText = newMessage.trim()
    setNewMessage("")

    try {
      await mockApi.sendMessage(agent.id, messageText)
      // Reload messages to get both user message and agent response
      setTimeout(() => {
        loadMessages()
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to send message:", error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'stopped': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${getStatusColor(agent.status)}`}></div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{agent.model} • {agent.status}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {agent.capabilities.map((capability) => (
            <Badge key={capability} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with {agent.name}</p>
                <p className="text-sm">{agent.description}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.isUser ? 'text-right' : ''}`}>
                    <div className={`rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-current rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              placeholder={`Message ${agent.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading || agent.status === 'stopped'}
            />
            <Button type="submit" size="sm" disabled={loading || !newMessage.trim() || agent.status === 'stopped'}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          {agent.status === 'stopped' && (
            <p className="text-xs text-muted-foreground mt-2">
              Agent is stopped. Start the agent to begin chatting.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

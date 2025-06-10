
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockApi, Agent } from "@/services/mockApi"
import { useToast } from "@/hooks/use-toast"

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: () => void
}

export function CreateTaskModal({ open, onOpenChange, onTaskCreated }: CreateTaskModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    agentId: "",
    agentName: ""
  })

  useEffect(() => {
    if (open) {
      loadAgents()
    }
  }, [open])

  const loadAgents = async () => {
    try {
      const agentList = await mockApi.getAgents()
      const activeAgents = agentList.filter(agent => agent.status !== 'stopped')
      setAgents(activeAgents)
    } catch (error) {
      console.error("Failed to load agents:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.agentId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      await mockApi.createTask(formData)
      toast({
        title: "Task Created",
        description: `Task "${formData.title}" has been assigned to ${formData.agentName}.`
      })
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        agentId: "",
        agentName: ""
      })
      
      onTaskCreated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAgentChange = (agentId: string) => {
    const selectedAgent = agents.find(agent => agent.id === agentId)
    setFormData(prev => ({
      ...prev,
      agentId,
      agentName: selectedAgent?.name || ""
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Assign a new task to one of your active agents.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Analyze sales data for Q4"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed instructions for the task..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent">Assign to Agent *</Label>
            <Select value={formData.agentId} onValueChange={handleAgentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.length === 0 ? (
                  <SelectItem value="no-agents" disabled>
                    No active agents available
                  </SelectItem>
                ) : (
                  agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${
                          agent.status === 'running' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>{agent.name}</span>
                        <span className="text-muted-foreground">({agent.model})</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || agents.length === 0}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

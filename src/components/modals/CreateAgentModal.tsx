
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockApi } from "@/services/mockApi"
import { useToast } from "@/hooks/use-toast"

interface CreateAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgentCreated: () => void
}

const modelOptions = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3.5", label: "Claude-3.5 Sonnet" },
  { value: "claude-3", label: "Claude-3 Opus" },
  { value: "llama-3.1", label: "Llama-3.1" },
  { value: "gemini-pro", label: "Gemini Pro" }
]

const capabilityOptions = [
  "Code Generation",
  "Debugging",
  "Documentation",
  "Code Review",
  "Web Research",
  "Data Analysis",
  "Report Generation",
  "Market Analysis",
  "Data Processing",
  "Statistical Analysis",
  "Visualization",
  "Insights",
  "Content Writing",
  "Translation",
  "Image Analysis",
  "File Processing"
]

export function CreateAgentModal({ open, onOpenChange, onAgentCreated }: CreateAgentModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    description: "",
    capabilities: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.model || !formData.description || formData.capabilities.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one capability.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      await mockApi.createAgent(formData)
      toast({
        title: "Agent Created",
        description: `${formData.name} has been successfully created and is ready to work.`
      })
      
      // Reset form
      setFormData({
        name: "",
        model: "",
        description: "",
        capabilities: []
      })
      
      onAgentCreated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCapabilityChange = (capability: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capability]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        capabilities: prev.capabilities.filter(c => c !== capability)
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Configure your new AI agent with specific capabilities and model preferences.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Marketing Assistant"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model *</Label>
            <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this agent will do and its primary purpose..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Capabilities * (Select at least one)</Label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-lg p-4">
              {capabilityOptions.map((capability) => (
                <div key={capability} className="flex items-center space-x-2">
                  <Checkbox
                    id={capability}
                    checked={formData.capabilities.includes(capability)}
                    onCheckedChange={(checked) => handleCapabilityChange(capability, checked as boolean)}
                  />
                  <Label
                    htmlFor={capability}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {capability}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

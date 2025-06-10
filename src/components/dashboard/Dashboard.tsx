
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CreateAgentModal } from "@/components/modals/CreateAgentModal"
import { CreateTaskModal } from "@/components/modals/CreateTaskModal"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { mockApi, Agent, Task, SystemMetrics } from "@/services/mockApi"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Play, Square, Trash2, Plus } from "lucide-react"

export function Dashboard() {
  const { toast } = useToast()
  const [agents, setAgents] = useState<Agent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [createAgentOpen, setCreateAgentOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [chatAgent, setChatAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    
    // Set up periodic updates for metrics
    const interval = setInterval(() => {
      loadMetrics()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [agentsData, tasksData, metricsData] = await Promise.all([
        mockApi.getAgents(),
        mockApi.getTasks(),
        mockApi.getSystemMetrics()
      ])
      
      setAgents(agentsData)
      setTasks(tasksData)
      setMetrics(metricsData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMetrics = async () => {
    try {
      const metricsData = await mockApi.getSystemMetrics()
      setMetrics(metricsData)
    } catch (error) {
      console.error("Failed to load metrics:", error)
    }
  }

  const handleAgentStatusChange = async (agentId: string, newStatus: Agent['status']) => {
    try {
      await mockApi.updateAgentStatus(agentId, newStatus)
      loadData()
      toast({
        title: "Agent Updated",
        description: `Agent status changed to ${newStatus}`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await mockApi.deleteAgent(agentId)
      loadData()
      toast({
        title: "Agent Deleted",
        description: "Agent has been removed from the system"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive"
      })
    }
  }

  const handleTaskProgress = async (taskId: string, progress: number) => {
    try {
      await mockApi.updateTaskProgress(taskId, progress)
      loadData()
    } catch (error) {
      console.error("Failed to update task progress:", error)
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

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'running': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'queued': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (chatAgent) {
    return (
      <div className="h-full">
        <ChatInterface
          agent={chatAgent}
          onClose={() => setChatAgent(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Badge variant="secondary">{metrics?.activeAgents || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeAgents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {agents.filter(a => a.status === 'running').length} running
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Badge variant="secondary">{metrics?.tasksCompleted || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.tasksCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.status === 'running').length} in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Badge variant="secondary">{metrics?.apiCalls || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.apiCalls?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Real-time usage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">{metrics?.successRate || 0}%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              System reliability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agents and Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Agents</CardTitle>
              <CardDescription>
                Manage your AI agents and their status
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setCreateAgentOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Agent
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No agents created yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setCreateAgentOpen(true)}
                >
                  Create your first agent
                </Button>
              </div>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.model} • {agent.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium">{agent.tasks} tasks</p>
                      <p className="text-xs text-muted-foreground">{agent.lastActivity}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setChatAgent(agent)}
                      disabled={agent.status === 'stopped'}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAgentStatusChange(agent.id, agent.status === 'running' ? 'stopped' : 'running')}
                    >
                      {agent.status === 'running' ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                Latest tasks and their progress
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks created yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setCreateTaskOpen(true)}
                >
                  Create your first task
                </Button>
              </div>
            ) : (
              tasks.slice(0, 5).map((task, index) => (
                <div key={task.id}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.agentName}</p>
                      </div>
                      <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Progress value={task.progress} className="h-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{task.progress}% complete</span>
                        {task.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => handleTaskProgress(task.id, Math.min(100, task.progress + 25))}
                          >
                            Simulate Progress
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < Math.min(tasks.length - 1, 4) && <Separator className="mt-4" />}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Real-time monitoring of AgentZero infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">{Math.round(metrics?.cpuUsage || 0)}%</span>
              </div>
              <Progress value={metrics?.cpuUsage || 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">{Math.round(metrics?.memoryUsage || 0)}%</span>
              </div>
              <Progress value={metrics?.memoryUsage || 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Rate Limit</span>
                <span className="text-sm text-muted-foreground">{Math.round(metrics?.apiRateLimit || 0)}%</span>
              </div>
              <Progress value={metrics?.apiRateLimit || 0} className="h-2" />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-2">
            <Button size="sm">View Logs</Button>
            <Button size="sm" variant="outline">Export Data</Button>
            <Button size="sm" variant="outline">Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateAgentModal
        open={createAgentOpen}
        onOpenChange={setCreateAgentOpen}
        onAgentCreated={loadData}
      />
      
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onTaskCreated={loadData}
      />
    </div>
  )
}

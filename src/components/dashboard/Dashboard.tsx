
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Badge variant="secondary">3</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Badge variant="secondary">156</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Badge variant="secondary">2.4k</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">
              +201 from last hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500">98%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Agents */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>
              Currently running AI agents and their status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Code Assistant</p>
                  <p className="text-sm text-muted-foreground">GPT-4 • Running</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">12 tasks</p>
                <p className="text-xs text-muted-foreground">2 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Web Researcher</p>
                  <p className="text-sm text-muted-foreground">Claude-3.5 • Running</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">8 tasks</p>
                <p className="text-xs text-muted-foreground">5 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Data Analyzer</p>
                  <p className="text-sm text-muted-foreground">Llama-3.1 • Idle</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">0 tasks</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Latest completed and ongoing tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Generate API documentation</p>
                  <p className="text-sm text-muted-foreground">Code Assistant</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">Completed</Badge>
              </div>
              <Progress value={100} className="h-1" />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Research market trends</p>
                  <p className="text-sm text-muted-foreground">Web Researcher</p>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Running</Badge>
              </div>
              <Progress value={65} className="h-1" />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Analyze user feedback</p>
                  <p className="text-sm text-muted-foreground">Data Analyzer</p>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Queued</Badge>
              </div>
              <Progress value={0} className="h-1" />
            </div>
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
                <span className="text-sm text-muted-foreground">34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Rate Limit</span>
                <span className="text-sm text-muted-foreground">12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-2">
            <Button size="sm">View Logs</Button>
            <Button size="sm" variant="outline">Export Data</Button>
            <Button size="sm" variant="outline">Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Badge } from "@/components/ui/badge"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-border bg-card`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A0</span>
                </div>
                <span className="font-semibold text-foreground">AgentZero</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 px-0"
            >
              <span className="sr-only">Toggle sidebar</span>
              <div className="h-4 w-4 border-2 border-current rounded"></div>
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-2">
              {sidebarOpen ? (
                <>
                  <div className="px-2 py-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Dashboard
                    </h3>
                  </div>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>Overview</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>Agents</span>
                    <Badge variant="secondary" className="ml-auto">3</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>Tasks</span>
                    <Badge variant="secondary" className="ml-auto">12</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>Models</span>
                  </Button>
                  
                  <div className="px-2 py-1 mt-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Management
                    </h3>
                  </div>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>Settings</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>API Keys</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <span>Logs</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-center px-2">
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-center px-2">
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-center px-2">
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </Button>
                </>
              )}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-border p-4">
            {sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="text-sm">
                    <div className="font-medium">Admin</div>
                    <div className="text-muted-foreground text-xs">Online</div>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="h-8 w-8 rounded-full bg-muted mx-auto"></div>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">AgentZero Dashboard</h1>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Online
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Input 
                placeholder="Search agents, tasks..." 
                className="w-64"
              />
              <Button size="sm">
                New Agent
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

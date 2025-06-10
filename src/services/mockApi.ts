
export interface Agent {
  id: string;
  name: string;
  model: string;
  status: 'running' | 'idle' | 'stopped';
  tasks: number;
  lastActivity: string;
  description: string;
  capabilities: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  status: 'completed' | 'running' | 'queued' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  message: string;
  timestamp: string;
  isUser: boolean;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  apiRateLimit: number;
  activeAgents: number;
  tasksCompleted: number;
  apiCalls: number;
  successRate: number;
}

// Mock data
let agents: Agent[] = [
  {
    id: '1',
    name: 'Code Assistant',
    model: 'GPT-4',
    status: 'running',
    tasks: 12,
    lastActivity: '2 min ago',
    description: 'Helps with code generation, debugging, and documentation',
    capabilities: ['Code Generation', 'Debugging', 'Documentation', 'Code Review']
  },
  {
    id: '2',
    name: 'Web Researcher',
    model: 'Claude-3.5',
    status: 'running',
    tasks: 8,
    lastActivity: '5 min ago',
    description: 'Researches web content and analyzes market trends',
    capabilities: ['Web Research', 'Data Analysis', 'Report Generation', 'Market Analysis']
  },
  {
    id: '3',
    name: 'Data Analyzer',
    model: 'Llama-3.1',
    status: 'idle',
    tasks: 0,
    lastActivity: '1 hour ago',
    description: 'Analyzes data and generates insights',
    capabilities: ['Data Processing', 'Statistical Analysis', 'Visualization', 'Insights']
  }
];

let tasks: Task[] = [
  {
    id: '1',
    title: 'Generate API documentation',
    description: 'Create comprehensive API documentation for the new endpoints',
    agentId: '1',
    agentName: 'Code Assistant',
    status: 'completed',
    progress: 100,
    createdAt: '2 hours ago',
    completedAt: '1 hour ago'
  },
  {
    id: '2',
    title: 'Research market trends',
    description: 'Analyze current market trends in AI and automation',
    agentId: '2',
    agentName: 'Web Researcher',
    status: 'running',
    progress: 65,
    createdAt: '3 hours ago'
  },
  {
    id: '3',
    title: 'Analyze user feedback',
    description: 'Process and analyze recent user feedback data',
    agentId: '3',
    agentName: 'Data Analyzer',
    status: 'queued',
    progress: 0,
    createdAt: '4 hours ago'
  }
];

let chatMessages: ChatMessage[] = [];

let systemMetrics: SystemMetrics = {
  cpuUsage: 34,
  memoryUsage: 67,
  apiRateLimit: 12,
  activeAgents: 3,
  tasksCompleted: 156,
  apiCalls: 2456,
  successRate: 98.5
};

// API functions
export const mockApi = {
  // Agents
  getAgents: (): Promise<Agent[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...agents]), 100));
  },

  createAgent: (agent: Omit<Agent, 'id' | 'tasks' | 'lastActivity' | 'status'>): Promise<Agent> => {
    return new Promise(resolve => {
      const newAgent: Agent = {
        ...agent,
        id: Date.now().toString(),
        tasks: 0,
        lastActivity: 'Just created',
        status: 'idle'
      };
      agents.push(newAgent);
      systemMetrics.activeAgents = agents.filter(a => a.status !== 'stopped').length;
      setTimeout(() => resolve(newAgent), 200);
    });
  },

  updateAgentStatus: (agentId: string, status: Agent['status']): Promise<Agent> => {
    return new Promise((resolve, reject) => {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        agent.status = status;
        agent.lastActivity = 'Just now';
        systemMetrics.activeAgents = agents.filter(a => a.status !== 'stopped').length;
        setTimeout(() => resolve(agent), 100);
      } else {
        reject(new Error('Agent not found'));
      }
    });
  },

  deleteAgent: (agentId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const index = agents.findIndex(a => a.id === agentId);
      if (index !== -1) {
        agents.splice(index, 1);
        systemMetrics.activeAgents = agents.filter(a => a.status !== 'stopped').length;
        setTimeout(() => resolve(), 100);
      } else {
        reject(new Error('Agent not found'));
      }
    });
  },

  // Tasks
  getTasks: (): Promise<Task[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...tasks]), 100));
  },

  createTask: (task: Omit<Task, 'id' | 'progress' | 'createdAt' | 'status'>): Promise<Task> => {
    return new Promise(resolve => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        progress: 0,
        status: 'queued',
        createdAt: 'Just now'
      };
      tasks.unshift(newTask);
      
      // Update agent task count
      const agent = agents.find(a => a.id === task.agentId);
      if (agent) {
        agent.tasks += 1;
      }
      
      setTimeout(() => resolve(newTask), 200);
    });
  },

  updateTaskProgress: (taskId: string, progress: number): Promise<Task> => {
    return new Promise((resolve, reject) => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.progress = progress;
        if (progress === 100) {
          task.status = 'completed';
          task.completedAt = 'Just now';
          systemMetrics.tasksCompleted += 1;
        } else if (progress > 0) {
          task.status = 'running';
        }
        setTimeout(() => resolve(task), 100);
      } else {
        reject(new Error('Task not found'));
      }
    });
  },

  // Chat
  getChatMessages: (agentId: string): Promise<ChatMessage[]> => {
    return new Promise(resolve => {
      const messages = chatMessages.filter(m => m.agentId === agentId);
      setTimeout(() => resolve(messages), 100);
    });
  },

  sendMessage: (agentId: string, message: string): Promise<ChatMessage> => {
    return new Promise(resolve => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        agentId,
        message,
        timestamp: new Date().toLocaleTimeString(),
        isUser: true
      };
      chatMessages.push(userMessage);

      // Simulate agent response after delay
      setTimeout(() => {
        const agentResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          agentId,
          message: `I received your message: "${message}". How can I help you with this?`,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false
        };
        chatMessages.push(agentResponse);
        systemMetrics.apiCalls += 1;
      }, 1000 + Math.random() * 2000);

      setTimeout(() => resolve(userMessage), 100);
    });
  },

  // System metrics
  getSystemMetrics: (): Promise<SystemMetrics> => {
    return new Promise(resolve => {
      // Simulate some variance in metrics
      const updatedMetrics = {
        ...systemMetrics,
        cpuUsage: Math.max(20, Math.min(80, systemMetrics.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, systemMetrics.memoryUsage + (Math.random() - 0.5) * 5)),
        apiRateLimit: Math.max(5, Math.min(50, systemMetrics.apiRateLimit + (Math.random() - 0.5) * 8))
      };
      setTimeout(() => resolve(updatedMetrics), 100);
    });
  }
};

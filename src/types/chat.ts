export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  subject?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  subject: string;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  color: string;
}
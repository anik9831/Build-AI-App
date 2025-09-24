import React from 'react';
import { ChatSession } from '../types/chat';
import { subjects } from '../config/subjects';
import { MessageCircle, Trash2 } from 'lucide-react';

interface SessionListProps {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function SessionList({ 
  sessions, 
  currentSession, 
  onSelectSession, 
  onDeleteSession 
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {sessions.map((session) => {
        const subject = subjects.find(s => s.id === session.subject);
        const isActive = currentSession?.id === session.id;
        
        return (
          <div
            key={session.id}
            className={`
              group p-3 rounded-lg cursor-pointer transition-all duration-200
              ${isActive 
                ? 'bg-blue-100 border-l-4 border-blue-500' 
                : 'hover:bg-gray-50'
              }
            `}
            onClick={() => onSelectSession(session)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <span className="text-lg">{subject?.icon || '🎓'}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.messages.length} messages
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
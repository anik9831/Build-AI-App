import { useState, useCallback } from 'react';
import { Message, ChatSession, Subject } from '../types/chat';
import { subjects } from '../config/subjects';

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    // Load API key from localStorage on initialization
    return localStorage.getItem('gemini-api-key') || '';
  });

  // Save API key to localStorage whenever it changes
  const updateApiKey = useCallback((key: string) => {
    setApiKey(key);
    if (key.trim()) {
      localStorage.setItem('gemini-api-key', key.trim());
    } else {
      localStorage.removeItem('gemini-api-key');
    }
  }, []);

  const createSession = useCallback((subject: Subject) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `${subject.name} Chat`,
      messages: [],
      subject: subject.id,
      createdAt: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    return newSession;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Update current session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    
    setCurrentSession(updatedSession);
    setSessions(prev => 
      prev.map(session => 
        session.id === updatedSession.id ? updatedSession : session
      )
    );

    setIsLoading(true);

    try {
      const subject = subjects.find(s => s.id === currentSession.subject);
      const systemPrompt = subject?.systemPrompt || subjects[0].systemPrompt;

      // Prepare conversation history for Gemini
      const conversationHistory = updatedSession.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Create the request payload for Gemini
      const requestBody = {
        contents: [
          // Add system prompt as the first user message
          {
            role: 'user',
            parts: [{ text: `System Instructions: ${systemPrompt}\n\nUser: ${content}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      // If there's conversation history, include it
      if (conversationHistory.length > 0) {
        requestBody.contents = [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: content }]
          }
        ];
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('Gemini API Error:', response.status, responseText);
        let errorMessage = 'Failed to get response from Gemini';
        
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          } else if (errorData.error?.details) {
            errorMessage = errorData.error.details;
          }
        } catch (e) {
          // Use default error message
        }
        
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      const data = JSON.parse(responseText);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.candidates[0].content.parts[0].text,
        role: 'assistant',
        timestamp: new Date()
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage]
      };

      setCurrentSession(finalSession);
      setSessions(prev => 
        prev.map(session => 
          session.id === finalSession.id ? finalSession : session
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorText = 'Invalid API key. Please check your Gemini API key and try again.';
        } else if (error.message.includes('429')) {
          errorText = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('quota')) {
          errorText = 'API quota exceeded. Please check your Google Cloud billing.';
        } else {
          errorText = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorText,
        role: 'assistant',
        timestamp: new Date()
      };

      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage]
      };

      setCurrentSession(errorSession);
      setSessions(prev => 
        prev.map(session => 
          session.id === errorSession.id ? errorSession : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, apiKey]);

  const selectSession = useCallback((session: ChatSession) => {
    setCurrentSession(session);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  return {
    sessions,
    currentSession,
    isLoading,
    apiKey,
    setApiKey: updateApiKey,
    createSession,
    sendMessage,
    selectSession,
    deleteSession
  };
}
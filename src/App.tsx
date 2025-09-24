import React, { useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat';
import { SubjectSelector } from './components/SubjectSelector';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SessionList } from './components/SessionList';
import { ApiKeyInput } from './components/ApiKeyInput';
import { TypingIndicator } from './components/TypingIndicator';
import { subjects } from './config/subjects';
import { BookOpen, MessageCircle, Settings, Plus } from 'lucide-react';

function App() {
  const {
    sessions,
    currentSession,
    isLoading,
    apiKey,
    setApiKey,
    createSession,
    sendMessage,
    selectSession,
    deleteSession
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApiSettings, setShowApiSettings] = React.useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleNewChat = () => {
    // Default to general education if no subject selected
    const generalSubject = subjects.find(s => s.id === 'general') || subjects[0];
    createSession(generalSubject);
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">EduChat AI</h1>
            <p className="text-gray-600">Your personalized educational assistant powered by Google Gemini</p>
          </div>
          
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Features:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>Powered by Google's advanced Gemini AI model</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500">•</span>
                <span>Subject-specific tutoring across 6 educational domains</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500">•</span>
                <span>Conversation history saved locally</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-amber-500">•</span>
                <span>API key stored securely in your browser</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h1 className="text-lg font-semibold text-gray-800">EduChat AI</h1>
            </div>
            <button
              onClick={() => setShowApiSettings(!showApiSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          
          {showApiSettings && (
            <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
          )}
          
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto">
          <SessionList
            sessions={sessions}
            currentSession={currentSession}
            onSelectSession={selectSession}
            onDeleteSession={deleteSession}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!currentSession ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Choose a Subject to Get Started
              </h2>
              <p className="text-gray-600">
                Select a subject area to begin your educational conversation
              </p>
            </div>
            <SubjectSelector
              onSelectSubject={createSession}
              selectedSubject={currentSession?.subject}
            />
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                {(() => {
                  const subject = subjects.find(s => s.id === currentSession.subject);
                  return (
                    <>
                      <span className="text-2xl">{subject?.icon || '🎓'}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {subject?.name || 'General Education'}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {subject?.description || 'General educational assistance'}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentSession.messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">
                    {subjects.find(s => s.id === currentSession.subject)?.icon || '🎓'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Ready to Learn!
                  </h3>
                  <p className="text-gray-600">
                    Ask me anything about {subjects.find(s => s.id === currentSession.subject)?.name.toLowerCase() || 'your studies'}
                  </p>
                </div>
              ) : (
                <>
                  {currentSession.messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && <TypingIndicator />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput
              onSendMessage={sendMessage}
              disabled={isLoading}
              placeholder={`Ask about ${subjects.find(s => s.id === currentSession.subject)?.name.toLowerCase() || 'your studies'}...`}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
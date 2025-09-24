import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-2 max-w-3xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 mr-2">
          <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-xs">🤖</span>
          </div>
        </div>
        
        <div className="px-4 py-3 rounded-2xl bg-gray-100 rounded-bl-md">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
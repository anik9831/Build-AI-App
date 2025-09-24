import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="p-4 bg-blue-50 border-b border-blue-200">
      <div className="flex items-center space-x-2 mb-2">
        <Key className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Google Gemini API Key Required</span>
      </div>
      
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="AIza..."
          className="w-full px-3 py-2 pr-10 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      
      <p className="text-xs text-blue-700 mt-1">
        Get your API key from{' '}
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          Google AI Studio
        </a>
        {apiKey && (
          <span className="block mt-1 text-green-600">
            ✓ API key saved locally
          </span>
        )}
      </p>
    </div>
  );
}
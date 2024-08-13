import React from 'react';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  imageUrl?: string;  // Add this line to include the imageUrl property
}

interface ChatInterfaceProps {
  messages: Message[];
  isAiTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isAiTyping }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`p-2 rounded-lg max-w-[70%] ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <p>{message.content}</p>
            {message.imageUrl && (
              <img 
                src={message.imageUrl} 
                alt="Generated image" 
                className="mt-2 max-w-full h-auto rounded-lg"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </div>
      ))}
      {isAiTyping && (
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <MessageCircle size={20} className="animate-pulse" />
          <span>AI is typing...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
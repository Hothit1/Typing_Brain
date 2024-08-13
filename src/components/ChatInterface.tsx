import React from 'react';
import { MessageCircle, Download } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isAiTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isAiTyping }) => {
  const handleDownload = (url: string, type: 'image' | 'audio') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated_${type}_${Date.now()}.${type === 'image' ? 'png' : 'mp3'}`;
    link.click();
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`p-2 rounded-lg max-w-[70%] ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <p>{message.content}</p>
            {message.imageUrl && (
              <div className="mt-2 flex items-center">
                <img
                  src={message.imageUrl}
                  alt="Generated image"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => handleDownload(message.imageUrl, 'image')}
                >
                  <Download size={16} />
                </button>
              </div>
            )}
            {message.audioUrl && (
              <div className="mt-2 flex items-center">
                <audio controls>
                  <source src={message.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => handleDownload(message.audioUrl, 'audio')}
                >
                  <Download size={16} />
                </button>
              </div>
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
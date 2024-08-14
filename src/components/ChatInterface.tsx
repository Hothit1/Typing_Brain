import React, { useState } from 'react';
import { MessageCircle, Download, Image as ImageIcon, Copy, Check, Code, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  role: 'user' | 'assistant' | 'system';
  imageUrl?: string;
  audioUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isAiTyping: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isAiTyping }) => {
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [previewStates, setPreviewStates] = useState<{[key: string]: boolean}>({});

  const handleDownload = (url: string, type: 'image' | 'audio') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated_${type}_${Date.now()}.${type === 'image' ? 'png' : 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
    });
  };

  const togglePreview = (id: string) => {
    setPreviewStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCodePreview = (code: string, language: string) => {
    if (!code.trim()) {
      return <div className="text-gray-500 italic">No code to preview.</div>;
    }

    if (language === 'html') {
      return (
        <div className="border border-gray-300 rounded p-2 bg-white h-64 overflow-auto">
          <iframe
            srcDoc={code} // Ensure the HTML code is passed correctly
            title="HTML Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts"
          />
        </div>
      );
    } else if (language === 'css') {
      return (
        <div className="border border-gray-300 rounded p-2 bg-white">
          <style>{code}</style>
          <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500">CSS Preview</div>
        </div>
      );
    } else {
      return <div className="text-gray-500 italic">Preview not available for this language.</div>;
    }
  };

  const renderContent = (content: string, messageId: number) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const [, language, ...codeParts] = part.split('\n');
        const code = codeParts.join('\n').slice(0, -3).trim();
        const id = `${messageId}-${index}`;
        const isPreview = previewStates[id];

        return (
          <div key={id} className="relative mt-2 rounded-md overflow-hidden">
            <div className="absolute top-2 right-2 z-10 flex space-x-2">
              <button
                className="p-1 bg-gray-800 rounded-md text-gray-300 hover:text-white focus:outline-none"
                onClick={() => togglePreview(id)}
              >
                {isPreview ? <Code size={16} /> : <Eye size={16} />}
              </button>
              <button
                className="p-1 bg-gray-800 rounded-md text-gray-300 hover:text-white focus:outline-none"
                onClick={() => handleCopy(code, id)}
              >
                {copiedStates[id] ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {isPreview ? (
              renderCodePreview(code, language) // Ensure language is passed correctly
            ) : (
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              >
                {code}
              </SyntaxHighlighter>
            )}
          </div>
        );
      } else {
        return <p key={`${messageId}-${index}`}>{part}</p>;
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div key={message.id} className="flex justify-start">
          <div
            className={`p-3 rounded-lg max-w-[70%] ${
              message.isUser ? 'bg-blue-100 text-black' : 'bg-gray-200 text-black'
            }`}
          >
            {message.role === 'user' && message.imageUrl && (
              <div className="mb-2">
                <ImageIcon size={16} className="inline mr-2" />
                <span className="text-sm">Image uploaded</span>
              </div>
            )}
            {renderContent(message.content, message.id)}
            {message.imageUrl && message.role === 'assistant' && (
              <div className="mt-2">
                <img
                  src={message.imageUrl}
                  alt="Generated or analyzed image"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  className="mt-1 text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  onClick={() => handleDownload(message.imageUrl!, 'image')}
                >
                  <Download size={16} className="inline mr-1" /> Download Image
                </button>
              </div>
            )}
            {message.audioUrl && (
              <div className="mt-2">
                <audio controls className="w-full">
                  <source src={message.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <button
                  className="mt-1 text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  onClick={() => handleDownload(message.audioUrl!, 'audio')}
                >
                  <Download size={16} className="inline mr-1" /> Download Audio
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {isAiTyping && (
        <div className="flex items-center space-x-2 text-gray-500">
          <MessageCircle size={20} className="animate-pulse" />
          <span>AI is thinking...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
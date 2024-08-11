import React, { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
}

interface MainChatProps {
  model: string;
  addon: string;
  chatId: string | null;
  onChatUpdate: (chatId: string, title: string) => void;
  currentGPT: string | null;
  chatTitle: string | null;
}

export default function MainChat({ model, addon, chatId, onChatUpdate, currentGPT, chatTitle }: MainChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId, messages.length]);

  useEffect(() => {
    if (chatId) {
      const savedMessages = localStorage.getItem(`chat_${chatId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
      setTitleGenerated(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (currentGPT && messages.length === 0) {
      addSystemMessage();
    }
  }, [currentGPT]);

  const addSystemMessage = async () => {
    if (currentGPT) {
      const gpts = JSON.parse(localStorage.getItem('gpts') || '[]');
      const selectedGPT = gpts.find((gpt: any) => gpt.id === currentGPT);
      if (selectedGPT) {
        const systemMessage: Message = {
          id: Date.now(),
          text: selectedGPT.systemMessage,
          isUser: false,
          role: 'system',
          content: selectedGPT.systemMessage,
        };
        setMessages([systemMessage]);
        if (chatId) {
          localStorage.setItem(`chat_${chatId}`, JSON.stringify([systemMessage]));
        }
      }
    }
  };

  const generateChatTitle = useCallback(async () => {
    if (!chatId || titleGenerated) return;

    try {
      console.log('Generating chat title...');
      const response = await fetch('/api/generateTitle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messages.filter(m => m.role !== 'system') }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate title');
      }

      const data = await response.json();
      console.log('Generated title:', data.title);
      onChatUpdate(chatId, data.title);
      setTitleGenerated(true);
    } catch (error) {
      console.error('Error generating title:', error);
    }
  }, [chatId, messages, onChatUpdate, titleGenerated]);

  useEffect(() => {
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (userMessageCount === 2 && !titleGenerated && chatId) {
      generateChatTitle();
    }
  }, [messages, generateChatTitle, titleGenerated, chatId]);

  const handleSend = async () => {
    if (inputText.trim() && !isLoading && chatId) {
      setIsLoading(true);
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        isUser: true,
        role: 'user',
        content: inputText,
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputText('');
      setError(null);

      localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedMessages));

      try {
        const response = await fetch('/api/generateResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: updatedMessages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            model,
            addon 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate response');
        }

        const data = await response.json();
        let assistantMessage: Message = { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: data.response,
          text: data.response,
          isUser: false 
        };

        if (addon === 'dalle' && data.imageUrl) {
          assistantMessage.imageUrl = data.imageUrl;
        }

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        localStorage.setItem(`chat_${chatId}`, JSON.stringify(finalMessages));
      } catch (error: any) {
        console.error('Error generating response:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {chatTitle && <h2 className="text-xl font-bold p-4">{chatTitle}</h2>}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </span>
            {message.imageUrl && (
              <div className="flex justify-center mt-2">
                <img 
                  src={message.imageUrl} 
                  alt="Generated image" 
                  className="max-w-xs max-h-64 object-contain" 
                />
              </div>
            )}
          </div>
        ))}
        {error && (
          <div className="mb-4 text-red-500">
            Error: {error}
          </div>
        )}
      </div>
      <div className="p-4 border-t flex">
        <Input
          ref={inputRef}
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !chatId}
        />
        <Button onClick={handleSend} disabled={isLoading || !chatId}>
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
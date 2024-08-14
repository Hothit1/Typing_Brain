import React, { useState, useEffect, useRef } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import ChatInterface from '../ChatInterface';
import FileUpload from '../FileUpload';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
  audioUrl?: string;
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
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
    }
  }, [chatId]);

  useEffect(() => {
    if (currentGPT && chatId) {
      const gpts = JSON.parse(localStorage.getItem('gpts') || '[]');
      const selectedGPT = gpts.find((gpt: any) => gpt.id === currentGPT);
      if (selectedGPT && messages.length === 0) {
        const systemMessage: Message = {
          id: Date.now(),
          text: selectedGPT.systemMessage,
          isUser: false,
          role: 'system',
          content: selectedGPT.systemMessage,
        };
        setMessages([systemMessage]);
        localStorage.setItem(`chat_${chatId}`, JSON.stringify([systemMessage]));
      }
    }
  }, [currentGPT, chatId, messages.length]);

  const handleSend = async () => {
    if ((inputText.trim() || selectedImage) && !isLoading && chatId) {
      setIsLoading(true);
      setIsAiTyping(true);
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
        const formData = new FormData();
        formData.append('data', JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model,
          addon, // Use the addon prop directly
        }));
        if (selectedImage) {
          formData.append('image', selectedImage);
        }
  
        const response = await fetch('/api/generateResponse', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Failed to generate response: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
  
        let assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          text: data.response,
          isUser: false,
        };
  
        if (data.imageUrl) {
          assistantMessage.imageUrl = data.imageUrl;
        }
        if (data.audioUrl) {
          assistantMessage.audioUrl = data.audioUrl;
        }
  
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        localStorage.setItem(`chat_${chatId}`, JSON.stringify(finalMessages));
  
        // Clear the selected image after sending
        setSelectedImage(null);
      } catch (error: any) {
        console.error('Error generating response:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
        setIsAiTyping(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
  };

  return (
    <div className="flex-1 flex flex-col">
      {chatTitle && <h2 className="text-xl font-bold p-4">{chatTitle}</h2>}
      <div className="flex-1 overflow-y-auto">
        <ChatInterface messages={messages} isAiTyping={isAiTyping} />
      </div>
      {error && (
        <div className="p-4 text-red-500">
          Error: {error}
        </div>
      )}
      <div className="p-4 border-t flex items-center">
        <FileUpload onFileSelect={handleFileSelect} />
        {selectedImage && (
          <div className="mr-2 text-sm text-gray-500">
            Image selected: {selectedImage.name}
          </div>
        )}
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
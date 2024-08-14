'use client'

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import MainChat from '@/components/Layout/MainChat';
import TopBar from '@/components/Layout/TopBar';

interface ChatTitle {
  [key: string]: string;
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [model, setModel] = useState('gpt-4o-mini');
  const [addon, setAddon] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [currentGPT, setCurrentGPT] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatTitles, setChatTitles] = useState<ChatTitle>({});

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Load chat titles from localStorage on initial render
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
      const parsedChatHistory = JSON.parse(storedChatHistory);
      const titles: ChatTitle = {};
      parsedChatHistory.forEach((chat: { id: string; title: string }) => {
        titles[chat.id] = chat.title;
      });
      setChatTitles(titles);
    }

    // Automatically create a new chat on initial load
    handleNewChat();
  }, []);

  const handleModelChange = (selectedModel: string) => {
    setModel(selectedModel);
  };

  const handleAddonChange = (selectedAddon: string) => {
    setAddon(selectedAddon);
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    setCurrentGPT(null);
  };

  const handleNewChat = (gptId?: string) => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setCurrentGPT(gptId || null);
    
    let initialMessages = [];
    if (gptId) {
      const gpts = JSON.parse(localStorage.getItem('gpts') || '[]');
      const selectedGPT = gpts.find((gpt: any) => gpt.id === gptId);
      if (selectedGPT) {
        initialMessages = [{
          id: Date.now(),
          role: 'system',
          content: selectedGPT.systemMessage
        }];
      }
    }
    
    setChatTitles(prev => ({ ...prev, [newChatId]: 'New Chat' }));
    
    // Update localStorage
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const updatedHistory = [{ id: newChatId, title: 'New Chat' }, ...chatHistory];
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    
    // Save initial messages for the new chat
    localStorage.setItem(`chat_${newChatId}`, JSON.stringify(initialMessages));
  };

  const handleGPTSelect = (gptId: string) => {
    setCurrentGPT(gptId);
    handleNewChat(gptId);
  };

  const handleChatUpdate = useCallback((chatId: string, title: string) => {
    setChatTitles(prev => ({ ...prev, [chatId]: title }));
    
    // Update chat history in localStorage
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const updatedHistory = chatHistory.map((chat: any) => 
      chat.id === chatId ? { ...chat, title } : chat
    );
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <TopBar onModelChange={handleModelChange} onAddonChange={handleAddonChange} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          onGPTSelect={handleGPTSelect}
          onChatUpdate={handleChatUpdate}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <MainChat
          model={model}
          addon={addon}
          chatId={currentChatId}
          onChatUpdate={handleChatUpdate}
          currentGPT={currentGPT}
          chatTitle={currentChatId ? chatTitles[currentChatId] : null}
        />
      </div>
    </div>
  );
}
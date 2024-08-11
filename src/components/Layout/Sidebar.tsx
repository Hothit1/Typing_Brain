import React, { useState, useEffect } from 'react';
import ChatHistoryItem from '../ChatHistoryItem';
import GPTItem from '../GPTItem';
import CreateGPTModal from '../CreateGPTModal';
import EditGPTModal from '../EditGPTModal';

interface SidebarProps {
  onChatSelect: (chatId: string) => void;
  onNewChat: (gptId?: string) => void;
  onGPTSelect: (gptId: string) => void;
  onChatUpdate: (chatId: string, title: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface ChatHistory {
  id: string;
  title: string;
}

interface GPT {
  id: string;
  name: string;
  systemMessage: string;
}

export default function Sidebar({ onChatSelect, onNewChat, onGPTSelect, onChatUpdate, isOpen, onToggle, isDarkMode, toggleDarkMode }: SidebarProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [gpts, setGPTs] = useState<GPT[]>([]);
  const [isCreateGPTModalOpen, setIsCreateGPTModalOpen] = useState(false);
  const [isEditGPTModalOpen, setIsEditGPTModalOpen] = useState(false);
  const [currentEditGPT, setCurrentEditGPT] = useState<GPT | null>(null);

  useEffect(() => {
    const loadedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const loadedGPTs = JSON.parse(localStorage.getItem('gpts') || '[]');
    setChatHistory(loadedChatHistory);
    setGPTs(loadedGPTs);
  }, []);

  const handleNewChat = (gptId?: string) => {
    onNewChat(gptId);
    const newChat = { id: Date.now().toString(), title: 'New Chat' };
    const updatedHistory = [newChat, ...chatHistory];
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    localStorage.removeItem(`chat_${chatId}`);
  };

  const handleCreateGPT = (name: string, systemMessage: string) => {
    const newGPT: GPT = { id: Date.now().toString(), name, systemMessage };
    const updatedGPTs = [...gpts, newGPT];
    setGPTs(updatedGPTs);
    localStorage.setItem('gpts', JSON.stringify(updatedGPTs));
    setIsCreateGPTModalOpen(false);
  };

  const handleEditGPT = (id: string, name: string, systemMessage: string) => {
    const updatedGPTs = gpts.map(gpt => 
      gpt.id === id ? { ...gpt, name, systemMessage } : gpt
    );
    setGPTs(updatedGPTs);
    localStorage.setItem('gpts', JSON.stringify(updatedGPTs));
    setIsEditGPTModalOpen(false);
    setCurrentEditGPT(null);
  };

  const handleDeleteGPT = (gptId: string) => {
    const updatedGPTs = gpts.filter(gpt => gpt.id !== gptId);
    setGPTs(updatedGPTs);
    localStorage.setItem('gpts', JSON.stringify(updatedGPTs));
  };

  const handleGPTSelect = (gptId: string) => {
    onGPTSelect(gptId);
    handleNewChat(gptId);
  };

  return (
    <div className={`bg-white border-r h-full flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex justify-between items-center p-4">
        <h2 className={`text-xl font-bold ${isOpen ? '' : 'hidden'}`}>Typing Brain</h2>
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full hover:bg-gray-200 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-gray-200 ml-2"
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>
      {isOpen && (
        <>
          <button 
            onClick={() => handleNewChat()}
            className="m-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            New Chat
          </button>
          
          <div className="flex-grow overflow-y-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center p-2">
                <h3 className="font-semibold">GPTs</h3>
                <button 
                  onClick={() => setIsCreateGPTModalOpen(true)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Create GPT
                </button>
              </div>
              {gpts.map((gpt) => (
                <GPTItem 
                  key={gpt.id} 
                  gpt={gpt} 
                  onSelect={() => handleGPTSelect(gpt.id)}
                  onEdit={() => {
                    setCurrentEditGPT(gpt);
                    setIsEditGPTModalOpen(true);
                  }}
                  onDelete={() => handleDeleteGPT(gpt.id)}
                />
              ))}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold p-2">Chat History</h3>
              {chatHistory.map((chat) => (
                <ChatHistoryItem 
                  key={chat.id} 
                  chat={chat} 
                  onSelect={() => onChatSelect(chat.id)}
                  onDelete={() => handleDeleteChat(chat.id)}
                />
              ))}
            </div>
          </div>

          <CreateGPTModal
            isOpen={isCreateGPTModalOpen}
            onClose={() => setIsCreateGPTModalOpen(false)}
            onCreateGPT={handleCreateGPT}
          />

          <EditGPTModal
            isOpen={isEditGPTModalOpen}
            onClose={() => {
              setIsEditGPTModalOpen(false);
              setCurrentEditGPT(null);
            }}
            onEditGPT={handleEditGPT}
            gpt={currentEditGPT}
          />
        </>
      )}
    </div>
  );
}
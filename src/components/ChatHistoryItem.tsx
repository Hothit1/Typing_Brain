import React from 'react';

interface ChatHistoryItemProps {
  chat: { id: string; title: string };
  onSelect: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export default function ChatHistoryItem({ chat, onSelect, onExport, onDelete }: ChatHistoryItemProps) {
  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer">
      <span onClick={onSelect} className="flex-grow">{chat.title}</span>
      <button onClick={(e) => { e.stopPropagation(); onExport(); }} className="text-sm text-blue-500 hover:text-blue-700 mr-2">
        Export
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-sm text-red-500 hover:text-red-700">
        Delete
      </button>
    </div>
  );
}
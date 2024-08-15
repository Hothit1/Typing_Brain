import React from 'react';

interface ChatHistoryItemProps {
  chat: {
    id: string;
    title: string;
  };
  onSelect: () => void;
  onDelete: () => void;
  onExport: () => void; // Add onExport prop
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ chat, onSelect, onDelete, onExport }) => {
  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-100">
      <div className="flex-1 cursor-pointer" onClick={onSelect}>
        {chat.title}
      </div>
      <div className="flex space-x-2">
        <button onClick={onExport} className="text-blue-500 hover:text-blue-700">
          Export
        </button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ChatHistoryItem;
import React from 'react';

interface GPTItemProps {
  gpt: {
    id: string;
    name: string;
    systemMessage: string;
  };
  onSelect: (gptId: string) => void;
  onEdit: (gptId: string) => void;
  onDelete: (gptId: string) => void;
}

export default function GPTItem({ gpt, onSelect, onEdit, onDelete }: GPTItemProps) {
  return (
    <div className="p-2 hover:bg-gray-100 flex items-center justify-between">
      <div 
        className="flex items-center cursor-pointer flex-grow"
        onClick={() => onSelect(gpt.id)}
      >
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
          {gpt.name[0].toUpperCase()}
        </div>
        <span>{gpt.name}</span>
      </div>
      <div>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(gpt.id); }}
          className="text-blue-500 hover:text-blue-700 mr-2"
        >
          Edit
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(gpt.id); }}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
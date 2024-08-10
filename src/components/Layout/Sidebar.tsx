import React from 'react';
import ModelSelector from '@/components/ModelSelector';

interface SidebarProps {
  onModelChange: (model: string) => void;
}

export default function Sidebar({ onModelChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r">
      <h2 className="text-xl font-bold p-4">Typing Brain</h2>
      <ModelSelector onModelChange={onModelChange} />
    </div>
  );
}
'use client'

import { useState } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import MainChat from '@/components/Layout/MainChat';
import InfoPanel from '@/components/Layout/InfoPanel';

export default function Home() {
  const [model, setModel] = useState('gpt-4o-mini');

  const handleModelChange = (selectedModel: string) => {
    setModel(selectedModel);
    console.log('Model changed to:', selectedModel);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onModelChange={handleModelChange} />
      <MainChat model={model} />
      <InfoPanel />
    </div>
  );
}
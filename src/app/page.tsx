'use client'

import Sidebar from '@/components/Layout/Sidebar';
import MainChat from '@/components/Layout/MainChat';
import InfoPanel from '@/components/Layout/InfoPanel';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <MainChat />
      <InfoPanel />
    </div>
  );
}
import React, { useState } from 'react';

interface CreateGPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGPT: (name: string, systemMessage: string) => void;
}

export default function CreateGPTModal({ isOpen, onClose, onCreateGPT }: CreateGPTModalProps) {
  const [name, setName] = useState('');
  const [systemMessage, setSystemMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGPT(name, systemMessage);
    setName('');
    setSystemMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Create New GPT</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="systemMessage" className="block mb-2">System Message:</label>
            <textarea
              id="systemMessage"
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              className="w-full border rounded px-2 py-1"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
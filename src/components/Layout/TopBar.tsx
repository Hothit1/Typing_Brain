import React, { useState } from 'react';
import ModelSelector from '../ModelSelector';  // Updated import path

interface TopBarProps {
  onModelChange: (model: string) => void;
  onAddonChange: (addon: string) => void;
}

export default function TopBar({ onModelChange, onAddonChange }: TopBarProps) {
  const [selectedAddon, setSelectedAddon] = useState('');

  const handleAddonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const addon = event.target.value;
    setSelectedAddon(addon);
    onAddonChange(addon);
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <ModelSelector onModelChange={onModelChange} />
      <div>
        <select 
          value={selectedAddon} 
          onChange={handleAddonChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Addon</option>
          <option value="dalle">DALL-E</option>
          {/* Add more addon options here */}
        </select>
      </div>
    </div>
  );
}
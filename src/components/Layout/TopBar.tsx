import React from 'react';
import ModelAddonSelector from '../ModelAddonSelector';

interface TopBarProps {
  onModelChange: (model: string) => void;
  onAddonChange: (addon: string) => void;
  model: string;
  addon: string;
}

export default function TopBar({ onModelChange, onAddonChange, model, addon }: TopBarProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <ModelAddonSelector 
        model={model}
        addon={addon} // Keep the addon state here
        onModelChange={onModelChange}
        onAddonChange={onAddonChange} // This will update the addon in MainChat
      />
    </div>
  );
}
import React from 'react';
import { Cpu, Plus } from 'lucide-react';

interface ModelAddonSelectorProps {
  model: string;
  addon: string;
  onModelChange: (model: string) => void;
  onAddonChange: (addon: string) => void;
}

const ModelAddonSelector: React.FC<ModelAddonSelectorProps> = ({ model, addon, onModelChange, onAddonChange }) => {
  return (
    <div className="flex space-x-4">
      <div className="relative">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="claude-3-sonnet">Claude 3.5 Sonnet</option>
          <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
          <option value="gpt-4-vision-preview">GPT-4 Vision</option>
          <option value="claude-3-opus-20240229">Claude 3 Opus (Vision)</option>
        </select>
        <Cpu className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      <div className="relative">
        <select
          value={addon}
          onChange={(e) => onAddonChange(e.target.value)}
          className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Addon</option>
          <option value="dalle">DALL-E</option>
          <option value="tts">Text-to-Speech</option>
        </select>
        <Plus className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default ModelAddonSelector;
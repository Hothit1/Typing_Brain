import React, { useState } from 'react';

interface ModelSelectorProps {
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = event.target.value;
    setSelectedModel(model);
    onModelChange(model);
  };

  return (
    <div>
      <select
        value={selectedModel}
        onChange={handleModelChange}
        className="border rounded px-3 py-2"
      >
        <option value="gpt-4o-mini">gpt-4o-mini</option>
        <option value="claude-3-sonnet">Claude 3.5 Sonnet</option>
        <option value="llama-3.1-70b-versatile">Groq llama-3.1-70b-versatile</option>
      </select>
    </div>
  );
};

export default ModelSelector;
import React, { useState } from 'react';

interface ModelSelectorProps {
  onModelChange: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const model = event.target.value;
    setSelectedModel(model);
    console.log('Model changed event:', event);
    console.log('New model selected:', model);
    onModelChange(model);
  };

  return (
    <div>
      <label htmlFor="model-select" className="block font-medium mb-2">
        Select Model:
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={handleModelChange}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="gpt-4o-mini">gpt-4o-mini</option>
        <option value="dalle-3">DALL-E 3</option>
        <option value="claude-3-sonnet">Claude 3.5 Sonnet</option>
      </select>
    </div>
  );
};

export default ModelSelector;
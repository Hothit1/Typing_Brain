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
        <option value="dalle-3">dalle-3</option>
        {/* Add more model options as needed */}
      </select>
    </div>
  );
};

export default ModelSelector;
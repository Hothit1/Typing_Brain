import ModelSelector from '@/components/ModelSelector';

export default function Sidebar() {
  const handleModelChange = (model: string) => {
    // Handle model change logic here
    console.log('Selected model:', model);
  };

  return (
    <div className="w-64 bg-white border-r">
      <h2 className="text-xl font-bold p-4">Typing Brain</h2>
      <ModelSelector onModelChange={handleModelChange} />
    </div>
  );
}
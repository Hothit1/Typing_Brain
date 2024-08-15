import React, { useRef } from 'react';
import { Image as UploadIcon } from 'lucide-react'; // Renamed for clarity

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Upload Image" // Add aria-label for accessibility
      >
        <UploadIcon size={24} /> {/* Updated line: using icon without src, width, height */}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
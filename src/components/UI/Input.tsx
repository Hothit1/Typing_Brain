interface InputProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export default function Input({ placeholder, value, onChange }: InputProps) {
    return (
      <input
        type="text"
        className="border rounded px-3 py-2 w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
import { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

interface MainChatProps {
  model: string;
}

export default function MainChat({ model }: MainChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        isUser: true,
        role: 'user',
        content: inputText,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      setError(null);

      try {
        const response = await fetch('/api/generateResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            messages: [...messages, newMessage].map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            model 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate response');
        }

        const data = await response.json();
        let assistantMessage: Message = { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: data.response,
          text: data.response,
          isUser: false 
        };

        if (model === 'dalle-3' && data.imageUrl) {
          assistantMessage.imageUrl = data.imageUrl;
        }

        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } catch (error: any) {
        console.error('Error generating response:', error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.text}
            </span>
            {message.imageUrl && (
              <img src={message.imageUrl} alt="Generated image" className="mt-2 max-w-full h-auto" />
            )}
          </div>
        ))}
        {error && (
          <div className="mb-4 text-red-500">
            Error: {error}
          </div>
        )}
      </div>
      <div className="p-4 border-t flex">
        <Input
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
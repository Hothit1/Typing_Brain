import { useState } from 'react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  role?: string; // Optional role property
  content?: string; // Optional content property
}

export default function MainChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(), // Consider using a more unique ID generator
        text: inputText,
        isUser: true,
        role: 'user', // Add role property for the user message
        content: inputText, // Set content for the user message
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update to include the new message
      setInputText('');

      try {
        const messagesWithAssistant = [
          ...messages.map(msg => ({
            ...msg,
            role: msg.isUser ? 'user' : 'assistant', // Ensure role is set for existing messages
            content: msg.text || '', // Ensure content is set for existing messages, default to empty string if null
          })),
          newMessage, // Add the new user message directly
        ];
        
        const response = await fetch('/api/generateResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: messagesWithAssistant, model: 'gpt-4o-mini' }),
        });

        const data = await response.json();
        const updatedMessages = [
          ...messagesWithAssistant,
          { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: data.response || '', // Ensure content is set from response, default to empty string if null
            text: data.response || '', // Set text to the response as well, default to empty string if null
            isUser: false 
          } as Message, // Cast to Message type
        ];
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Error generating response:', error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id} // Ensure this is unique
            className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
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
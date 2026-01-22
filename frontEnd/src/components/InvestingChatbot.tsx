import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

type InvestorType = 'conservative' | 'balanced' | 'adventurous';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface InvestingChatbotProps {
  investorType: InvestorType;
  userEmail: string;
}

export function InvestingChatbot({ investorType, userEmail }: InvestingChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm your AI investing assistant. I see you're a ${investorType} investor. Feel free to ask me any questions about investing, stocks, portfolios, or financial strategies tailored to your profile!`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  if (!userEmail || userEmail.trim() === "") {
    console.error("No user email provided!");
    const botMessage: Message = {
      id: Date.now().toString(),
      text: "Error: Missing email. Cannot ask the assistant.",
      sender: "bot",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    return;
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputValue,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsTyping(true);

  console.log("Sending POST with:", { email: userEmail, question: inputValue });

  try {
    const response = await fetch("http://127.0.0.1:5001/rag/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, question: inputValue })
    });

    const data = await response.json();

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: data.answer || "Sorry, I couldn't generate a response.",
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error("Error calling /rag/ask:", error);
    const botMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: "There was an error connecting to the server.",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  } finally {
    setIsTyping(false);
  }
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

   return (
  <div className="chat-container">
    <div className="chat-header">
      <MessageCircle style={{ width: 24, height: 24, color: 'white' }} />
      <div>
        <h3>AI Investing</h3>
        <p>Ask me anything about investing</p>
      </div>
    </div>

    <div className="chat-messages">
      {messages.map((message) => (
        <div key={message.id} className={`message-row ${message.sender === 'user' ? 'user' : ''}`}>
          <div className={`avatar ${message.sender === 'bot' ? 'bot' : 'user'}`}>
            {message.sender === 'bot' ? (
              <Bot style={{ width: 18, height: 18, color: '#10b981' }} />
            ) : (
              <User style={{ width: 18, height: 18, color: '#3b82f6' }} />
            )}
          </div>
          
          <div className="bubble-container">
            <div className="bubble">
              <p style={{ margin: 0 }}>{message.text}</p>
            </div>
            <span className="timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <div className="chat-footer">
      <div className="input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about stocks, ETFs, risk management..."
        />
        <button 
          className="send-button" 
          onClick={handleSendMessage} 
          disabled={!inputValue.trim()}
        >
          <Send style={{ width: 20, height: 20, color: '#94a3b8' }} />
        </button>
      </div>
    </div>
  </div>
);
}

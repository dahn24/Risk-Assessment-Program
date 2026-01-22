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
}

export function InvestingChatbot({ investorType }: InvestingChatbotProps) {
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

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Investment type specific responses
    const typeAdvice: Record<InvestorType, string> = {
      conservative: 'Given your conservative profile, I recommend focusing on stable, low-risk investments.',
      balanced: 'As a balanced investor, you can benefit from a diversified portfolio mixing growth and stability.',
      adventurous: 'With your adventurous profile, you have more flexibility to explore high-growth opportunities.'
    };

    // Common investing questions
    if (lowerMessage.includes('diversif')) {
      return `Diversification is crucial for managing risk. ${typeAdvice[investorType]} Consider spreading your investments across different asset classes, sectors, and geographic regions.`;
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('equity')) {
      if (investorType === 'conservative') {
        return 'For conservative investors, I recommend blue-chip stocks with strong dividend histories, like established utilities or consumer staples companies.';
      } else if (investorType === 'balanced') {
        return 'Balanced investors should consider a mix of growth and value stocks. Look at index funds like S&P 500 for broad market exposure.';
      } else {
        return 'Adventurous investors can explore growth stocks in technology, emerging markets, or small-cap companies with high potential.';
      }
    }

    if (lowerMessage.includes('bond')) {
      return `Bonds provide stability and regular income. ${investorType === 'conservative' ? 'They should form a significant portion of your portfolio.' : investorType === 'balanced' ? 'Consider allocating 30-50% to bonds for balance.' : 'You might allocate 10-20% to bonds for some stability.'}`;
    }

    if (lowerMessage.includes('risk')) {
      return `Risk management is essential. ${typeAdvice[investorType]} Use techniques like dollar-cost averaging and maintain an emergency fund equal to 3-6 months of expenses.`;
    }

    if (lowerMessage.includes('etf') || lowerMessage.includes('index fund')) {
      return 'ETFs and index funds are excellent for diversification and lower fees. They\'re suitable for all investor types and provide broad market exposure.';
    }

    if (lowerMessage.includes('retirement') || lowerMessage.includes('401k') || lowerMessage.includes('ira')) {
      return 'Retirement accounts like 401(k)s and IRAs offer tax advantages. Max out employer matches first, then consider Roth IRAs for tax-free growth.';
    }

    if (lowerMessage.includes('when') && (lowerMessage.includes('buy') || lowerMessage.includes('sell'))) {
      return 'Timing the market is difficult. Instead, focus on time in the market. Regular contributions and a long-term perspective typically outperform trying to time purchases.';
    }

    if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin')) {
      if (investorType === 'conservative') {
        return 'Cryptocurrency is highly volatile and speculative. For conservative investors, it\'s generally not recommended, or should be kept to less than 1-2% of your portfolio.';
      } else if (investorType === 'balanced') {
        return 'Crypto can be part of a balanced portfolio, but keep allocation small (3-5%) due to high volatility. Treat it as a speculative investment.';
      } else {
        return 'Adventurous investors can allocate 5-10% to cryptocurrency, but remember it\'s highly volatile. Only invest what you can afford to lose.';
      }
    }

    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      return `Great question! Start by: 1) Building an emergency fund, 2) Paying off high-interest debt, 3) Opening a brokerage account, 4) Starting with index funds or ETFs that match your ${investorType} profile.`;
    }

    // Default response
    return `That's an interesting question about ${userMessage}. As a ${investorType} investor, I recommend doing thorough research and consulting with a financial advisor for personalized advice. Would you like to know more about any specific investment strategy?`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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

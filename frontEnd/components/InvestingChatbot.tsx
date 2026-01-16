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
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700">
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4 rounded-t-lg flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-white" />
        <div>
          <h3 className="font-semibold text-white">AI Investing Assistant</h3>
          <p className="text-sm text-emerald-100">Ask me anything about investing</p>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.sender === 'bot' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
            }`}>
              {message.sender === 'bot' ? (
                <Bot className="w-5 h-5 text-emerald-400" />
              ) : (
                <User className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-lg p-3 ${
                message.sender === 'bot'
                  ? 'bg-slate-700 text-slate-100'
                  : 'bg-blue-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about stocks, ETFs, risk management..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

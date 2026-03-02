import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

const mockResponses = [
  "The current time flows like liquid silver through the digital realm. How may I assist you today?",
  "I'm here to help! Whether you need quick calculations, creative ideas, or just a conversation, I'm at your service.",
  "Time is the most precious resource we have. Let me help you make the most of it.",
  "That's a fascinating question! Let me think about that for a moment...",
  "I appreciate your curiosity. Here's what I think about that...",
];

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: "Hello! I'm your AI assistant powered by Claude. Ask me anything for quick responses.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = async (userMessage: string) => {
    setIsTyping(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

    const response = userMessage.toLowerCase().includes('time')
      ? `The time is ${new Date().toLocaleTimeString()}. ${mockResponses[0]}`
      : mockResponses[Math.floor(Math.random() * mockResponses.length)];

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'assistant',
        content: response,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    simulateResponse(input.trim());
  };

  return (
    <div className="flex flex-col h-[65vh] md:h-[60vh] max-h-[500px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="font-display text-xs tracking-wider text-white/70">CLAUDE API</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-3">Quick Responses</h2>
        <p className="font-body text-white/40 text-sm mt-1">AI-powered assistance at your fingertips</p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-br-md'
                    : 'bg-white/10 backdrop-blur-xl border border-white/10 text-white/90 rounded-bl-md'
                }`}
              >
                <p className="font-body text-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-bl-md">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="mt-4"
      >
        <div className="flex gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 chrome-border backdrop-blur-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/30 font-body text-sm focus:outline-none min-h-[48px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white font-display text-sm tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-violet-500/30 active:scale-95 min-h-[48px] min-w-[48px]"
          >
            Send
          </button>
        </div>
      </motion.form>
    </div>
  );
}

export default AIAssistant;

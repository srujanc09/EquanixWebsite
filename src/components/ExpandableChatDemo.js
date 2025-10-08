"use client";

import React, { useRef, useState } from "react";
import { X, MessageCircle, Send, Bot, User } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

// Utility function
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// Button component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Chat components
const ChatBubble = React.forwardRef(({ className, variant = "received", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-end gap-2",
      variant === "sent" ? "justify-end" : "justify-start",
      className,
    )}
    {...props}
  />
));
ChatBubble.displayName = "ChatBubble";

const ChatBubbleMessage = React.forwardRef(({ className, variant = "received", isLoading = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative max-w-[75%] rounded-lg px-3 py-2 text-sm",
      variant === "sent"
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground",
      isLoading && "animate-pulse",
      className,
    )}
    {...props}
  >
    {isLoading ? (
      <div className="flex space-x-1">
        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
      </div>
    ) : (
      props.children
    )}
  </div>
));
ChatBubbleMessage.displayName = "ChatBubbleMessage";

const ChatMessageList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-4 pb-2", className)}
    {...props}
  />
));
ChatMessageList.displayName = "ChatMessageList";

export default function ExpandableChatDemo() {
  // Add blinking cursor animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
      .animate-blink {
        animation: blink 1s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const conversationLoop = [
    { content: "Hi! I'm your AI trading strategy assistant. How can I help you today?", sender: "ai" },
    { content: "I want to create a momentum trading strategy for crypto markets.", sender: "user" },
    { content: "Great choice! I can help you build a momentum strategy using RSI and moving averages. Would you like me to start with backtesting parameters?", sender: "ai" },
    { content: "Yes, please show me how to optimize the lookback periods.", sender: "user" },
  ];

  const [messages, setMessages] = useState([conversationLoop[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % conversationLoop.length;
        if (nextIndex === 0) {
          setMessages([conversationLoop[0]]);
        } else {
          setMessages(conversationLoop.slice(0, nextIndex + 1));
        }
        return nextIndex;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-8 items-stretch -mt-20">
      {/* AI Demo Widget */}
      <div className="w-1/2 p-4">
        <div className="w-full h-[600px] bg-gray-100 border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-900 text-white">
          <h1 className="text-xl font-semibold">Equanix AI Demo</h1>
          <Bot className="h-6 w-6" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatMessageList>
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gray-300">
                  {message.sender === "user" ? (
                    <User className="h-5 w-5 text-gray-600" />
                  ) : (
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                      <div className="h-2.5 w-2.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <ChatBubbleMessage
                  className={`text-xl ${message.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-300"} p-4 rounded-lg`}
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
          </ChatMessageList>
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-white focus-within:ring-1 focus-within:ring-blue-400">
            <div className="flex-1 text-base text-gray-500 relative">
              <textarea 
                className="w-full text-lg text-gray-900 bg-transparent border-none outline-none resize-none placeholder-transparent"
                placeholder="Ask about trading strategies..."
                rows={1}
                style={{ minHeight: '24px' }}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center">
                <span className="text-gray-500 text-lg">
                  Ask about trading strategies...
                  <span className="ml-1 animate-blink">|</span>
                </span>
              </div>
            </div>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="w-1/2 p-4">
        <div className="h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 flex flex-col">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-3">
              AI Strategy Assistant
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"></div>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Strategy Development</h3>
                <p className="text-gray-300 leading-relaxed">
                  Describe your trading ideas in plain English and watch our AI transform them into 
                  quantitative strategies with proper risk management and backtesting parameters.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get instant feedback on strategy performance, risk metrics, and optimization 
                  suggestions as you refine your trading approach.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Interactive Learning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ask questions about market patterns, backtesting results, or strategy modifications 
                  and receive detailed explanations tailored to your experience level.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

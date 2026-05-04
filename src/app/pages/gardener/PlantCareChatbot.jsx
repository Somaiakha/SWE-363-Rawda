// src/app/pages/gardener/PlantCareChatbot.jsx
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link } from "react-router";

export default function PlantCareChatbot() {
  const [messages, setMessages]     = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const [error, setError]           = useState(null);
  const messagesEndRef              = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestedQuestions = [
    "How often should I water my succulents?",
    "What are common signs of overwatering?",
    "How do I deal with yellow leaves?",
    "Best indoor plants for beginners?",
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id:        Date.now().toString(),
      type:      "user",
      text:      inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userText = inputValue;
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      // Build conversation history
      const history = [...messages, userMessage].map((m) => ({
        role:    m.type === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const token = localStorage.getItem("rawda_token");
      const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/chat`,
          {
            method:  "POST",
            headers: {
              "Content-Type":  "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ messages: history }),
          }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get response");
      }

      const botText = data.reply || "I'm not sure about that. Could you rephrase your question?";

      const botMessage = {
        id:        (Date.now() + 1).toString(),
        type:      "bot",
        text:      botText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Chatbot temporarily unavailable. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (question) => {
    setInputValue(question);
  };

  return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <Link to="/gardener" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Plant Care Assistant</h1>
              <p className="text-sm text-gray-600">Powered by Claude AI — Ask me anything about plant care</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🌿</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Plant Care Assistant!</h3>
                  <p className="text-gray-600 mb-6">Ask me anything about plant care, and I'll help you out.</p>
                  <div className="max-w-lg mx-auto">
                    <p className="text-sm font-medium text-gray-700 mb-3">Try these questions:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestedQuestions.map((question, index) => (
                          <button
                              key={index}
                              onClick={() => handleSuggestionClick(question)}
                              className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                          >
                            {question}
                          </button>
                      ))}
                    </div>
                  </div>
                </div>
            )}

            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "bot" && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-sm">🌿</span>
                      </div>
                  )}
                  <div className={`max-w-[70%] rounded-lg px-4 py-3 ${
                      message.type === "user" ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-900"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-green-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
            ))}

            {isTyping && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-sm">🌿</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
            )}

            {error && (
                <div className="flex justify-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about plant care..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
              <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
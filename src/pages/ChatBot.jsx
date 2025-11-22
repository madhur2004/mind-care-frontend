import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Bot, User, Trash2, Volume2 } from "lucide-react";
import ChatBot3D from "../components/ChatBot3D";
import VoiceChatBot from "../components/VoiceChatBot";
import { chatAPI } from "../utils/api";

export default function ChatBot({ userName, theme }) {
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(`chatMessages_${userName}`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "init",
            text: `Hello ${
              userName || "friend"
            }! I'm Mindful Companion. How can I support you today?`,
            sender: "bot",
            timestamp: Date.now(),
          },
        ];
  });

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(
      `chatMessages_${userName}`,
      JSON.stringify(messages)
    );
  }, [messages, userName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [inputText]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(`chatMessages_${userName}`);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userName]);

  const addMessage = (text, sender = "user") => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    addMessage(text, "user");
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const resp = await chatAPI.sendMessage(text);
      const botText = resp?.data?.reply || "I'm here for you — tell me more.";
      addMessage(botText, "bot");
    } catch (err) {
      console.error("Chat error:", err);
      addMessage(
        "I'm experiencing some technical difficulties, but I'm still here for you.",
        "bot"
      );
    } finally {
      setLoading(false);
    }
  };

  const speakMessage = (text) => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "init",
        text: `Hello ${
          userName || "friend"
        }! Our conversation has been cleared. How can I support you today?`,
        sender: "bot",
        timestamp: Date.now(),
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const handleVoiceTranscript = (text) => {
    if (text?.trim()) {
      setInputText(text);
      setTimeout(() => handleSendMessage(text), 100);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-4 chat-bot-container">
      {/* HEADER */}
      <div
        className={`w-full max-w-5xl bg-white/80 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-xl p-4 mb-8 flex justify-between items-center shadow-lg`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <ChatBot3D />
          </div>
          <div>
            <h1 className="text-lg font-bold chat-text-primary">
              Wellness Assistant
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your AI mental wellness companion
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-white/20 rounded-lg hover:bg-red-50 dark:hover:bg-red-600/20 transition-colors duration-200"
        >
          <Trash2 size={16} className="inline-block mr-2" />
          Clear
        </button>
      </div>

      {/* CENTERED CHAT CARD */}
      <div
        className={`w-full max-w-5xl rounded-2xl bg-white/90 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200 dark:border-white/20 shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* CHAT AREA */}
        <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                    <Bot className="text-white w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-md user-message"
                      : "bg-gray-100 dark:bg-white/20 border border-gray-200 dark:border-white/10 rounded-bl-md bot-message"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-sm">
                    <User className="text-white w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="text-white w-4" />
              </div>
              <div className="bg-gray-100 dark:bg-white/20 px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT AREA */}
        <div className="p-6 border-t border-gray-200 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-xl">
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-3 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 chat-text-primary input-field-fix"
              rows={1}
              style={{
                lineHeight: "1.5",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={loading || !inputText.trim()}
              className="px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-xl flex items-center justify-center transition-colors duration-200 shadow-sm send-btn"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <VoiceChatBot
            onTranscript={handleVoiceTranscript}
            userName={userName}
            isSpeaking={isSpeaking}
            onSpeakMessage={speakMessage}
            lastBotMessage={
              messages.filter((msg) => msg.sender === "bot").pop()?.text
            }
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

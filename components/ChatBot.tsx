"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Towfiq's AI assistant. Ask me anything about his skills, projects, research, or experience!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "Sorry, something went wrong." },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40 hover:scale-110 transition"
      >
        {open ? <FiX className="text-2xl text-white" /> : <FiMessageCircle className="text-2xl text-white" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[200] w-[90vw] max-w-sm h-[70vh] max-h-[500px] bg-[#111117] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/10 px-4 py-3">
              <p className="font-semibold text-sm">Ask about Towfiq</p>
              <p className="text-xs text-gray-400">AI-powered portfolio assistant</p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[80%] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm"
                        : "max-w-[80%] bg-white/5 border border-white/10 text-gray-200 text-sm px-4 py-2 rounded-2xl rounded-bl-sm"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-gray-400 text-sm px-4 py-2 rounded-2xl rounded-bl-sm">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a question..."
                className="flex-1 bg-black/30 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-400 transition"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 flex-shrink-0"
              >
                <FiSend className="text-white text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
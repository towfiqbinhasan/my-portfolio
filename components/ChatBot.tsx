"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiCpu } from "react-icons/fi";

type Message = {
  role: "user" | "assistant";
  content: string;
  typing?: boolean; // true = still being "typed out" on screen
};

export default function ChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState("");
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
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fullGreeting = "Hi, I'm Towfiq's AI Agent chat with me!";

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, open]);

  // Show the auto-greeting bubble once, only on the home page
  useEffect(() => {
    if (pathname !== "/") return;

    const alreadyGreeted = sessionStorage.getItem("chatbot_greeted");
    if (alreadyGreeted) return;

    const timer = setTimeout(() => {
      setShowGreeting(true);
      sessionStorage.setItem("chatbot_greeted", "true");

      const hideTimer = setTimeout(() => {
        setShowGreeting(false);
      }, 7000);

      return () => clearTimeout(hideTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Typing effect for the greeting bubble
  useEffect(() => {
    if (!showGreeting) {
      setGreetingText("");
      return;
    }
    let i = 0;
    const typing = setInterval(() => {
      i++;
      setGreetingText(fullGreeting.slice(0, i));
      if (i >= fullGreeting.length) clearInterval(typing);
    }, 28);

    return () => clearInterval(typing);
  }, [showGreeting]);

  // Cleanup any running typing animation on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  // Reveal a full reply gradually inside the chat, word by word,
  // like a person actually typing it out.
  function typeOutReply(fullText: string) {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    const words = fullText.split(" ");
    let wordIndex = 0;

    // Add an empty "typing" message first
    setMessages((prev) => [...prev, { role: "assistant", content: "", typing: true }]);

    typingTimerRef.current = setInterval(() => {
      wordIndex++;
      const partial = words.slice(0, wordIndex).join(" ");

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: partial,
          typing: wordIndex < words.length,
        };
        return updated;
      });

      if (wordIndex >= words.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 55); // typing speed (ms per word) — adjust for slower/faster feel
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Groq/OpenAI-compatible API শুধু role আর content accept করে —
    // "typing" এর মতো extra field পাঠালে API error দেয়, তাই clean করে পাঠাচ্ছি
    const cleanMessages = newMessages.map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: cleanMessages }),
      });
      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        typeOutReply(data.reply || "Sorry, something went wrong. Please try again.");
        return;
      }

      typeOutReply(data.reply || "Sorry, I couldn't generate a response.");
    } catch (err) {
      setLoading(false);
      typeOutReply("Sorry, something went wrong. Please try again.");
    }
  }

  function handleOpen() {
    setOpen(true);
    setShowGreeting(false);
  }

  return (
    <>
      {/* Auto Greeting Bubble */}
      <AnimatePresence>
        {showGreeting && !open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={handleOpen}
            className="fixed bottom-24 right-6 z-[200] flex items-end gap-2 cursor-pointer"
          >
            {/* Bot Avatar */}
            <div className="relative flex-shrink-0">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(168,85,247,0.4)",
                    "0 0 18px rgba(168,85,247,0.7)",
                    "0 0 0px rgba(168,85,247,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <FiCpu className="text-white text-lg" />
              </motion.div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#111117]">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
              </span>
            </div>

            {/* Message bubble */}
            <div className="max-w-[220px] bg-[#111117]/95 backdrop-blur-md border border-purple-400/30 rounded-2xl rounded-bl-sm shadow-2xl shadow-purple-500/20 px-4 py-3">
              <p className="text-xs text-purple-300 font-medium mb-0.5 flex items-center gap-1">
                Towfiq's AI Agent
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </p>
              <p className="text-sm text-gray-200 min-h-[1.25rem]">
                {greetingText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-[2px] h-[14px] bg-purple-400 ml-0.5 align-middle"
                />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40 hover:scale-110 transition"
      >
        {open ? <FiX className="text-2xl text-white" /> : <FiMessageCircle className="text-2xl text-white" />}
      </motion.button>

      {/* Chat Window */}
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
                        : "max-w-[80%] bg-white/5 border border-white/10 text-gray-200 text-sm px-4 py-2 rounded-2xl rounded-bl-sm whitespace-pre-wrap"
                    }
                  >
                    {msg.content}
                    {msg.typing && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-[2px] h-[13px] bg-gray-300 ml-0.5 align-middle"
                      />
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-gray-400 text-sm px-4 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
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
"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiMessageCircle, FiX, FiSend, FiRefreshCw, FiChevronDown } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

type Message = {
  role: "user" | "assistant";
  content: string;
  typing?: boolean; // true = still being "typed out" on screen
};

const GREETING: Message = {
  role: "assistant",
  content: "Hi! I'm Towfiq's AI assistant. Ask me anything about his skills, projects, research, or experience!",
};

const SUGGESTIONS = [
  "What are his strongest skills?",
  "Tell me about his research",
  "Show his best projects",
  "How can I contact him?",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingText, setGreetingText] = useState("");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fullGreeting = "Hi, I'm Towfiq's AI Agent — chat with me!";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  // Escape closes the window; focus the field when it opens
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const focus = setTimeout(() => inputRef.current?.focus(), 350);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(focus);
    };
  }, [open]);

  // Show the auto-greeting bubble once, only on the home page
  useEffect(() => {
    if (pathname !== "/") return;

    const alreadyGreeted = sessionStorage.getItem("chatbot_greeted");
    if (alreadyGreeted) return;

    const timer = setTimeout(() => {
      setGreetingText("");
      setShowGreeting(true);
      sessionStorage.setItem("chatbot_greeted", "true");

      const hideTimer = setTimeout(() => {
        setShowGreeting(false);
      }, 8000);

      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Typing effect for the greeting bubble
  useEffect(() => {
    if (!showGreeting) return;
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
    }, 55); // typing speed (ms per word)
  }

  async function sendMessage(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: question }];
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
    } catch {
      setLoading(false);
      typeOutReply("Sorry, something went wrong. Please try again.");
    }
  }

  function resetChat() {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setMessages([GREETING]);
    setInput("");
    setLoading(false);
    inputRef.current?.focus();
  }

  function handleOpen() {
    setOpen(true);
    setShowGreeting(false);
  }

  const fresh = messages.length === 1 && !loading;

  return (
    <>
      {/* Auto greeting bubble */}
      <AnimatePresence>
        {showGreeting && !open && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.45, ease }}
            onClick={handleOpen}
            className="fixed bottom-24 right-4 sm:right-6 z-[200] flex items-end gap-2.5 text-left"
          >
            <span className="relative flex-shrink-0">
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(14, 165, 233,0.35)",
                    "0 0 22px rgba(14, 165, 233,0.75)",
                    "0 0 0px rgba(14, 165, 233,0.35)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400"
              >
                <HiSparkles className="text-lg text-white" />
              </motion.span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#081630] bg-emerald-400">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
              </span>
            </span>

            <span className="max-w-[230px] rounded-2xl rounded-bl-md border border-sky-400/25 bg-[#081630]/95 px-4 py-3 shadow-2xl shadow-sky-500/20 backdrop-blur-md">
              <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-medium text-sky-300">
                Towfiq&apos;s AI Agent
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="block min-h-[1.25rem] text-sm text-gray-200">
                {greetingText}
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="ml-0.5 inline-block h-[14px] w-px align-middle bg-sky-400"
                />
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-4 sm:right-6 z-[200] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/40"
      >
        {!open && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-sky-500/30" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22 }}
            className="relative text-2xl text-white"
          >
            {open ? <FiChevronDown /> : <FiMessageCircle />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-4 sm:right-6 z-[200] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#04102a]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-sky-600/20 via-blue-600/10 to-cyan-500/20 px-4 py-3.5">
              <div className="relative flex-shrink-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-sky-400/40">
                  <Image src="/logo.png" alt="Towfiq's AI assistant" fill sizes="40px" className="object-cover" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#04102a] bg-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  Towfiq&apos;s AI Assistant
                  <HiSparkles className="text-xs text-sky-300" />
                </p>
                <p className="truncate text-[11px] text-emerald-300/90">
                  {loading ? "Typing…" : "Online · usually replies instantly"}
                </p>
              </div>

              <button
                onClick={resetChat}
                aria-label="Start a new chat"
                title="New chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <FiRefreshCw className="text-sm" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <FiX />
              </button>

              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="chat-scroll flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease }}
                  className={msg.role === "user" ? "flex justify-end gap-2" : "flex items-end gap-2"}
                >
                  {msg.role === "assistant" && (
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-xs text-white">
                      <HiSparkles />
                    </span>
                  )}
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[78%] rounded-2xl rounded-br-md bg-gradient-to-br from-sky-500 to-cyan-400 px-4 py-2.5 text-sm leading-relaxed text-white shadow-lg shadow-sky-500/20"
                        : "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm leading-relaxed text-gray-200"
                    }
                  >
                    {msg.content}
                    {msg.typing && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                        className="ml-0.5 inline-block h-[13px] w-px align-middle bg-sky-300"
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-xs text-white">
                    <HiSparkles />
                  </span>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300" />
                  </div>
                </motion.div>
              )}

              {/* Starter questions, only while the chat is untouched */}
              <AnimatePresence>
                {fresh && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease }}
                    className="space-y-2 pl-9 pt-1"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-gray-500">Try asking</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={s}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease }}
                          onClick={() => sendMessage(s)}
                          className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200 transition hover:border-sky-400/60 hover:bg-sky-500/20 hover:text-white"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Composer */}
            <div className="border-t border-white/10 bg-black/30 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4 transition focus-within:border-sky-400/60 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_3px_rgba(14, 165, 233,0.12)]"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about Towfiq…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Send message"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  <FiSend className="text-sm" />
                </motion.button>
              </form>
              <p className="mt-2 text-center text-[10px] text-gray-600">
                AI answers may be imperfect · Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

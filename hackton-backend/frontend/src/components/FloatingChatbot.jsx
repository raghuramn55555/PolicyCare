import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function FloatingChatbot({ userProfile }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Namaste! I am your PolicySetu Assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("en");

    const scrollRef = useRef(null);

    // Auto scroll
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: input,
                    language: language,
                    profile: userProfile || {}
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.reply || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting. Please try again soon." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const suggestions = [
        "What is PMJAY?",
        "Am I eligible for PM Kisan?",
        "Compare term insurance",
        "Find agent near 500001",
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-96 h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border"
                    >
                        {/* Header */}
                        <div className="bg-[#0F4C75] text-white p-5 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-sm">PolicySetu Advisor</h3>
                                <p className="text-[10px] opacity-70">
                                    Government & Insurance Guide
                                </p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-white/20 text-xs px-2 py-1 rounded"
                                >
                                    <option value="en">EN</option>
                                    <option value="hi">HI</option>
                                    <option value="te">TE</option>
                                </select>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow ${msg.role === "user"
                                            ? "bg-[#0F4C75] text-white rounded-br-none"
                                            : "bg-white border rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="text-xs text-gray-400 animate-pulse">
                                    Assistant is thinking...
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {messages.length <= 1 && (
                            <div className="px-4 py-2 flex flex-wrap gap-2 bg-white border-t">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="text-xs px-3 py-1 border rounded-full hover:bg-[#0F4C75] hover:text-white transition"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-4 border-t flex gap-2 bg-white"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                                placeholder="Ask about policies..."
                                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C75]"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#0F4C75] text-white px-4 rounded-xl hover:scale-105 active:scale-95 transition"
                            >
                                →
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-[#0F4C75] text-white rounded-full shadow-xl flex items-center justify-center text-2xl border-4 border-white"
            >
                🤖
            </motion.button>
        </div>
    );
}

export default FloatingChatbot;
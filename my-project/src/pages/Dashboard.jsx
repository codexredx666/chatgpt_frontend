import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    History,
    LayoutGrid,
    LogOut,
    Mic,
    AudioLines,
    MessageSquare,
    PanelLeft,
    Image as ImageIcon,
    Cpu,
    ArrowUp,
    X
} from 'lucide-react';

const Dashboard = ({ username = "Guest User" }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isHoveringLogo, setIsHoveringLogo] = useState(false);

    // Chat State
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    // Search & History State
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [history, setHistory] = useState([]);

    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getInitials = (name) => name.substring(0, 2).toUpperCase();
    const handleLogout = () => navigate('/login');
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // --- API CALL TO BACKEND ---
    const sendMessageToBackend = async (userMessage) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response from backend");
            }

            const data = await response.json();
            return data.response; // The text from OpenAI via your Backend
        } catch (error) {
            console.error("Error connecting to backend:", error);
            return "Error: Could not connect to the backend. Is your FastAPI server running?";
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setInput("");
        setIsSidebarOpen(false);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // 1. Add User Message to UI
        const currentInput = input;
        const userMsgObject = { role: 'user', text: currentInput };
        setMessages(prev => [...prev, userMsgObject]);

        setInput("");
        setIsTyping(true);

        // 2. Call your Backend API
        const aiResponseText = await sendMessageToBackend(currentInput);

        // 3. Add AI Response to UI
        const aiMsgObject = { role: 'ai', text: aiResponseText };
        setMessages(prev => [...prev, aiMsgObject]);
        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    // Filter History Logic (Placeholder until you connect DB history)
    const filteredHistory = history.filter(item =>
        item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen w-full bg-white text-[#0d0d0d] font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside
                className={`fixed left-0 top-0 h-full z-50 bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col overflow-hidden whitespace-nowrap ${isSidebarOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full'
                    }`}
            >
                <div className="p-3 pb-2 flex flex-col gap-2">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-lg transition text-gray-700 w-full justify-between group"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded bg-white border shadow-sm"><Plus size={16} /></div>
                            <span className="text-sm font-medium">New chat</span>
                        </div>
                        <MessageSquare size={16} className="opacity-0 group-hover:opacity-50 transition" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                    {isSearchActive ? (
                        <div className="px-2 mb-2">
                            <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-2 py-1.5 focus-within:border-blue-500 ring-0 transition">
                                <Search size={14} className="text-gray-400 mr-2" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full text-sm outline-none text-gray-700 placeholder:text-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button onClick={() => { setIsSearchActive(false); setSearchQuery("") }} className="hover:bg-gray-100 rounded p-0.5">
                                    <X size={14} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-2">
                            <SidebarItem icon={<Search size={18} />} label="Search chats" onClick={() => setIsSearchActive(true)} />
                            <SidebarItem icon={<History size={18} />} label="History" />
                        </div>
                    )}

                    {/* History List */}
                    <div className="mt-4 px-2">
                        <div className="text-xs font-semibold text-gray-400 mb-2 ml-2">Recent</div>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => (
                                <button key={item.id} className="w-full text-left p-2 rounded-lg hover:bg-black/5 text-sm text-gray-700 truncate transition mb-1">
                                    {item.title}
                                </button>
                            ))
                        ) : (
                            <div className="text-xs text-gray-400 ml-2 italic">No chats found</div>
                        )}
                    </div>
                </div>

                <div className="p-3 border-t border-gray-200 mt-auto bg-gray-50">
                    <SidebarItem icon={<LogOut size={18} className="text-red-500" />} label="Logout" onClick={handleLogout} />
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition cursor-pointer mt-2">
                        <div className="w-8 h-8 min-w-[32px] bg-black text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">{getInitials(username)}</div>
                        <div className="flex flex-col truncate">
                            <span className="font-semibold text-sm text-gray-900">{username}</span>
                            <span className="text-xs text-gray-500">Free Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={`flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[260px]' : 'ml-0'}`}>

                <header className="flex justify-between items-center px-4 py-2 sticky top-0 z-40 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            onMouseEnter={() => setIsHoveringLogo(true)}
                            onMouseLeave={() => setIsHoveringLogo(false)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 transition-colors group text-gray-700"
                        >
                            {isSidebarOpen || isHoveringLogo ? <PanelLeft size={20} className="text-gray-500" /> : <div className="flex items-center justify-center w-5 h-5"><MessageSquare size={18} /></div>}
                            <span className="font-semibold text-lg text-gray-800">ChatGPT <span className="text-gray-400 text-xs align-middle">▼</span></span>
                        </button>
                    </div>
                    <button className="bg-white hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 transition shadow-sm">✦ Get Plus</button>
                </header>

                <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto overflow-hidden">

                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center px-4">
                            <h1 className="text-3xl font-semibold mb-8 text-[#212121]">Where should we begin?</h1>
                            <div className="flex gap-2 flex-wrap justify-center mb-8">
                                <ActionChip icon={<ImageIcon size={14} />} label="Create image" />
                                <ActionChip icon={<Cpu size={14} />} label="Write code" />
                                <ActionChip icon={<LayoutGrid size={14} />} label="Brainstorm" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-6">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                            <Cpu size={18} />
                                        </div>
                                    )}
                                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-[#f4f4f4] text-gray-900 rounded-tr-sm' : 'text-gray-900'
                                        }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-4 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0"><Cpu size={18} /></div>
                                    <div className="text-gray-400 text-sm self-center animate-pulse">Thinking...</div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    <div className="w-full px-4 pb-6 pt-2">
                        <div className="bg-[#f4f4f4] rounded-3xl p-3 flex items-center gap-2 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all">
                            <button className="p-2 hover:bg-black/5 rounded-full text-gray-500 transition"><Plus size={20} /></button>
                            <input
                                type="text"
                                placeholder="Ask anything"
                                className="bg-transparent flex-1 outline-none text-lg placeholder:text-gray-500 text-black px-2"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isTyping}
                            />
                            {input.length > 0 ? (
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isTyping}
                                    className={`p-2 bg-black text-white rounded-full transition shadow-md ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                                >
                                    <ArrowUp size={18} />
                                </button>
                            ) : (
                                <button className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md opacity-50 cursor-default">
                                    <ArrowUp size={18} />
                                </button>
                            )}
                        </div>
                        <div className="text-center text-xs text-gray-400 mt-2">
                            ChatGPT can make mistakes. Check important info.
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 p-2.5 rounded-lg transition hover:bg-black/5 text-gray-700 w-full text-left">
        <div className="text-gray-500">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const ActionChip = ({ icon, label }) => (
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
        {icon} {label}
    </button>
);

export default Dashboard;
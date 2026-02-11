import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
            // Decode email from JWT token if possible
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserEmail(payload.sub || payload.email || 'User');
            } catch {
                setUserEmail('User');
            }
        }

        // Set greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_type');
        setIsLoggedIn(false);
        setUserEmail('');
        navigate('/');
    };

    // ─── NOT LOGGED IN ─────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
                {/* Decorative blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 text-center max-w-lg">
                    {/* Icon */}
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
                    <p className="text-slate-400 text-lg mb-10">Sign in to access your dashboard or create a new account to get started.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ─── LOGGED IN DASHBOARD ───────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Top Bar */}
            <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-lg">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2">
                            <div className="w-7 h-7 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                <span className="text-indigo-400 text-xs font-bold">{userEmail.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-slate-300 text-sm">{userEmail}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Greeting */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white">{greeting}, <span className="text-indigo-400">{userEmail.split('@')[0]}</span> 👋</h1>
                    <p className="text-slate-400 mt-2">Here's what's happening with your account today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {[
                        { label: 'Total Chats', value: '128', icon: '💬', color: 'from-blue-500 to-cyan-500' },
                        { label: 'Messages Sent', value: '1,024', icon: '📨', color: 'from-indigo-500 to-purple-500' },
                        { label: 'Tokens Used', value: '45.2K', icon: '⚡', color: 'from-amber-500 to-orange-500' },
                        { label: 'Days Active', value: '32', icon: '📅', color: 'from-emerald-500 to-teal-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">{stat.icon}</span>
                                <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${stat.color}`}></div>
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-white mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <button className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-left hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-indigo-500/10 group-hover:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-1">New Chat</h3>
                            <p className="text-slate-400 text-sm">Start a new conversation</p>
                        </button>

                        <button className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-left hover:bg-purple-600/10 hover:border-purple-500/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-purple-500/10 group-hover:bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-1">Chat History</h3>
                            <p className="text-slate-400 text-sm">View past conversations</p>
                        </button>

                        <button className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-left hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all duration-300">
                            <div className="w-12 h-12 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-1">Settings</h3>
                            <p className="text-slate-400 text-sm">Manage your preferences</p>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-5">Recent Activity</h2>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
                        {[
                            { title: 'Signed in successfully', time: 'Just now', icon: '🔑' },
                            { title: 'Profile updated', time: '2 hours ago', icon: '✏️' },
                            { title: 'New chat started', time: 'Yesterday', icon: '💬' },
                        ].map((activity, i) => (
                            <div key={i} className={`flex items-center gap-4 p-4 ${i !== 2 ? 'border-b border-slate-700/30' : ''} hover:bg-slate-700/20 transition-colors`}>
                                <span className="text-xl">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">{activity.title}</p>
                                    <p className="text-slate-500 text-xs">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
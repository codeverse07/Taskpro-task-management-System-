import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Settings, Sun, Moon, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import PasswordModal from './PasswordModal';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') !== 'light';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="glass-panel border-b-0 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-lg shadow-cyan-500/30">
                                    TaskPro
                                </span>
                            </div>
                            <div className="hidden sm:ml-8 md:flex sm:space-x-8">
                                <span className="border-cyan-400 text-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold tracking-wide">
                                    Command Center
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="flex-shrink-0 flex items-center">
                                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border mr-2 sm:mr-4 shadow-lg ${isDarkMode ? 'bg-slate-950/50 border-slate-700 text-cyan-400 shadow-cyan-500/10' : 'bg-white border-slate-200 text-cyan-600 shadow-slate-200'}`}>
                                    <span className="hidden xs:inline">Access: </span>{user?.role}
                                </span>
                                <button
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className={`p-2 rounded-full transition-all ${isDarkMode ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40' : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-200'} mr-1 sm:mr-2`}
                                    title="Toggle Theme"
                                >
                                    {isDarkMode ? <Sun className="h-5 w-5 transition-transform hover:rotate-45" /> : <Moon className="h-5 w-5 transition-transform hover:-rotate-12" />}
                                </button>
                            </div>
                            <div className={`ml-1 sm:ml-3 relative flex items-center gap-2 sm:gap-4 border-l border-slate-700/20 pl-2 sm:pl-6`}>
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors group"
                                >
                                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform cursor-pointer">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <span className="hidden md:block font-bold tracking-wide flex items-center">
                                        {user?.name}
                                        <Settings className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </span>
                                </button>
                                <button
                                    onClick={() => setIsPasswordOpen(true)}
                                    className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-slate-900/50 text-slate-400 hover:text-fuchsia-400 hover:bg-slate-800' : 'bg-slate-100 text-slate-500 hover:text-fuchsia-600 hover:bg-slate-200'}`}
                                    title="Change Password"
                                >
                                    <Key className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-2 sm:px-4 py-2 border border-transparent text-[10px] sm:text-xs font-bold rounded-lg text-white bg-red-600/10 hover:bg-red-600/20 border-red-500/30 hover:border-red-500 hover:shadow-xl transition-all duration-300"
                                >
                                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Disconnect</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <PasswordModal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
        </>
    );
};

export default Navbar;

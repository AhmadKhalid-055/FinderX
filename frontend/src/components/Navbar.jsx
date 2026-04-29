import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 mb-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Search className="text-blue-600" /> FinderX
                </Link>
                <div className="flex items-center gap-6">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
                    </button>
                    {user ? (
                        <>
                            <Link to="/create" className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
                                <PlusCircle size={20} /> Post Item
                            </Link>
                            <Link to="/dashboard" className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
                                <User size={20} /> Dashboard
                            </Link>
                            <button onClick={logout} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 font-medium">Login</Link>
                            <Link to="/register" className="btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

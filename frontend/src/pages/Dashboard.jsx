import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { PlusCircle, Trash2, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch user's items
            const itemsRes = await axios.get('/api/items');
            // Since there is no user filter on backend, filter here or modify backend. 
            // For now filtering on client side based on user id.
            const userItems = itemsRes.data.filter(item => item.user._id === user.id);
            setItems(userItems);

            // Fetch messages
            const msgRes = await axios.get('/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(msgRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await axios.delete(`/api/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Item deleted');
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="glass p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage your reported items and messages.</p>
                </div>
                <Link to="/create" className="btn-primary flex items-center gap-2">
                    <PlusCircle size={20} /> Post New Item
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Your Items</h3>
                    {items.length === 0 ? (
                        <div className="glass p-8 text-center text-gray-500">
                            You haven't posted any items yet.
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-6">
                            {items.map(item => (
                                <div key={item._id} className="relative">
                                    <ItemCard item={item} />
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="absolute top-2 left-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-red-500 hover:text-red-700 shadow-md transition-colors"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <MessageSquare /> Messages
                    </h3>
                    <div className="glass p-4 h-[500px] overflow-y-auto space-y-4">
                        {messages.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No messages yet.</p>
                        ) : (
                            messages.map(msg => (
                                <div key={msg._id} className={`p-4 rounded-lg border ${msg.sender._id === user.id ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 ml-4' : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 mr-4'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                                            {msg.sender._id === user.id ? 'You' : msg.sender.name}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {msg.item && (
                                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 font-medium">
                                            Re: {msg.item.title}
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{msg.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

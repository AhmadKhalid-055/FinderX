import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Tag, ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ItemCard from '../components/ItemCard';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    
    const [item, setItem] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const fetchItemDetails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/items/${id}`);
            setItem(res.data);
            
            // Fetch matches if user is authenticated
            if (token) {
                const matchRes = await axios.get(`/api/items/${id}/matches`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMatches(matchRes.data);
            }
        } catch (error) {
            console.error(error);
            toast.error('Item not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to send messages');
            return;
        }
        if (!message.trim()) return;

        setSending(true);
        try {
            await axios.post('/api/messages', {
                receiver: item.user._id,
                item: item._id,
                message: message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Message sent to owner!');
            setMessage('');
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    if (!item) return null;

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
                <ArrowLeft size={20} /> Back
            </button>

            <div className="glass overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 min-h-[300px] bg-gray-100 dark:bg-gray-800 relative">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center absolute inset-0">
                            <span className="text-gray-400">No Image Available</span>
                        </div>
                    )}
                    <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg ${item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}>
                        {item.type.toUpperCase()}
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:w-1/2 p-8 flex flex-col">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h1>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600 dark:text-gray-300 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg"><Tag size={18} className="text-blue-500"/> {item.category}</div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg"><MapPin size={18} className="text-red-500"/> {item.location}</div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg"><Calendar size={18} className="text-green-500"/> {format(new Date(item.date), 'PPP')}</div>
                    </div>

                    <div className="mb-8 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.description}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mt-auto">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Posted by {item.user.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">Contact the owner if you have information.</p>
                        
                        {user && user.id !== item.user._id ? (
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    className="input-field flex-grow"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                                <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2">
                                    <Send size={18} /> {sending ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        ) : !user ? (
                            <p className="text-sm text-blue-600"><Link to="/login" className="underline">Login</Link> to contact owner.</p>
                        ) : (
                            <p className="text-sm text-green-600 font-medium">This is your item.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Smart Matches Section */}
            {user && matches.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-blue-500 pl-4">
                        Smart Matches Suggested For You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {matches.map(match => (
                            <ItemCard key={match._id} item={match} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetail;

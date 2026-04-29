import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const Home = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ keyword: '', type: '', category: '' });

    useEffect(() => {
        fetchItems();
    }, [filters.type, filters.category]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const res = await axios.get(`/api/items?${queryParams}`);
            setItems(res.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="text-center py-16 px-4 bg-gradient-to-b from-blue-50 to-transparent dark:from-gray-800 rounded-3xl mb-12">
                <h1 className="text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
                    Lost it? <span className="text-blue-600">Find it!</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    The modern, fast, and secure way to report and recover lost items in your community.
                </p>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by keywords..." 
                            className="input-field pl-12 h-12 text-lg"
                            value={filters.keyword}
                            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                        />
                    </div>
                    <select 
                        className="input-field w-full md:w-48 h-12"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                        <option value="">All Types</option>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                    <select 
                        className="input-field w-full md:w-48 h-12"
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Pets">Pets</option>
                        <option value="Wallet/Keys">Wallet/Keys</option>
                        <option value="Bags">Bags</option>
                        <option value="Other">Other</option>
                    </select>
                    <button type="submit" className="btn-primary h-12 px-8 text-lg">Search</button>
                </form>
            </div>

            {/* Results Grid */}
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">Recent Reports</h2>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(item => (
                        <ItemCard key={item._id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 glass">
                    <Search className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No items found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default Home;

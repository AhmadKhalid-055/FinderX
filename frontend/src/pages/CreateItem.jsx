import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CreateItem = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'lost',
        category: 'Electronics',
        location: '',
        date: new Date().toISOString().split('T')[0],
        image: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/items', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Item posted successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to post item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="glass p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Report an Item</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Item Type</label>
                            <select 
                                className="input-field" 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="lost">Lost</option>
                                <option value="found">Found</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select 
                                className="input-field" 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Pets">Pets</option>
                                <option value="Wallet/Keys">Wallet/Keys</option>
                                <option value="Bags">Bags</option>
                                <option value="Documents">Documents</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input 
                            type="text" 
                            required 
                            className="input-field" 
                            placeholder="e.g. Black iPhone 13"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                            required 
                            rows="4"
                            className="input-field" 
                            placeholder="Provide detailed description, color, marks, etc."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input 
                                type="text" 
                                required 
                                className="input-field" 
                                placeholder="Where was it lost/found?"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input 
                                type="date" 
                                required 
                                className="input-field" 
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Upload Image (Optional)</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input-field py-1"
                        />
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="mt-4 h-40 object-cover rounded-lg border border-gray-200" />
                        )}
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 text-lg" disabled={loading}>
                        {loading ? 'Posting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateItem;

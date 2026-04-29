import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

const ItemCard = ({ item }) => {
    return (
        <div className="glass card-hover overflow-hidden flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
                {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No Image</span>
                    </div>
                )}
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${item.type === 'lost' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {item.type.toUpperCase()}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                
                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2"><Tag size={16} /> {item.category}</div>
                    <div className="flex items-center gap-2"><MapPin size={16} /> {item.location}</div>
                    <div className="flex items-center gap-2"><Calendar size={16} /> {format(new Date(item.date), 'PPP')}</div>
                </div>
                
                <Link to={`/item/${item._id}`} className="mt-auto btn-primary text-center">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ItemCard;

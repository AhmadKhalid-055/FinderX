const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String }, // base64 string or url
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Text index for AI matching/Search
ItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', ItemSchema);

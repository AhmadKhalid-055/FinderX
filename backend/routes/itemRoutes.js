const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');

// @route   POST api/items
// @desc    Create an item
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            user: req.user.id
        });
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { keyword, category, date, location, type } = req.query;
        let query = {};

        if (keyword) {
            query.$text = { $search: keyword };
        }
        if (category) query.category = category;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (type) query.type = type;
        // date filter could be added similarly

        const items = await Item.find(query).populate('user', ['name', 'email']).sort({ date: -1 });
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('user', ['name', 'email']);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Item not found' });
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Check user (or admin)
        if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Item not found' });
        res.status(500).send('Server Error');
    }
});

// Smart Feature: Find matches
// @route   GET api/items/:id/matches
// @desc    Get similar items based on keywords/category
// @access  Private
router.get('/:id/matches', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const oppositeType = item.type === 'lost' ? 'found' : 'lost';

        // Search for items of opposite type with same category or matching keywords
        const matches = await Item.find({
            type: oppositeType,
            $or: [
                { category: item.category },
                { $text: { $search: item.title + " " + item.description } }
            ],
            _id: { $ne: item._id }
        }).limit(5);

        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

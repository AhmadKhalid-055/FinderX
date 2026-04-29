const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { receiver, item, message } = req.body;
        const newMessage = new Message({
            sender: req.user.id,
            receiver,
            item,
            message
        });
        const savedMessage = await newMessage.save();
        res.json(savedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/messages
// @desc    Get all messages for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        }).populate('sender', 'name email').populate('receiver', 'name email').populate('item', 'title image type').sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

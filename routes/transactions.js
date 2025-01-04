const router = require('express').Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .sort({ timestamp: -1 })
      .populate('sender receiver', 'name email');
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send money
router.post('/transfer', auth, async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;
    const amountNum = parseFloat(amount);

    // Validate amount
    if (amountNum <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Find sender and receiver
    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (sender.walletBalance < amountNum) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: amountNum,
      type: 'TRANSFER',
      status: 'COMPLETED'
    });

    // Update balances
    sender.walletBalance -= amountNum;
    receiver.walletBalance += amountNum;

    await Promise.all([
      transaction.save(),
      sender.save(),
      receiver.save()
    ]);

    res.json({
      message: 'Transfer successful',
      transaction,
      newBalance: sender.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add money to wallet
router.post('/add-money', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const amountNum = parseFloat(amount);

    if (amountNum <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    user.walletBalance += amountNum;

    const transaction = new Transaction({
      sender: user._id,
      receiver: user._id,
      amount: amountNum,
      type: 'RECHARGE',
      status: 'COMPLETED'
    });

    await Promise.all([
      transaction.save(),
      user.save()
    ]);

    res.json({
      message: 'Money added successfully',
      transaction,
      newBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
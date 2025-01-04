const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add money to wallet
router.post('/add', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    
    user.walletBalance += parseFloat(amount);
    await user.save();

    // Create transaction record
    await Transaction.create({
      sender: user._id,
      receiver: user._id,
      amount: amount,
      type: 'RECHARGE',
      status: 'COMPLETED'
    });

    res.json({ 
      message: 'Money added successfully',
      newBalance: user.walletBalance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
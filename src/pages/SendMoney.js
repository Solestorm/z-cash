import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Close } from '@mui/icons-material';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';

function SendMoney() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    accountNumber: '',
    amount: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!formData.recipientName || !formData.recipientPhone || !formData.accountNumber || !formData.amount) {
        throw new Error('Please fill in all fields');
      }

      if (!/^\d{10}$/.test(formData.recipientPhone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (!/^\d{10,12}$/.test(formData.accountNumber)) {
        throw new Error('Please enter a valid account number (10-12 digits)');
      }

      // Get current user's data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const amount = parseFloat(formData.amount);

      // Validate amount
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (amount > currentUser.walletBalance) {
        throw new Error('Insufficient balance');
      }

      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user's balance
      const newBalance = currentUser.walletBalance - amount;
      currentUser.walletBalance = newBalance;
      localStorage.setItem('user', JSON.stringify(currentUser));

      // Create transaction record
      const transaction = {
        type: 'debit',
        amount: amount,
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        accountNumber: formData.accountNumber,
        date: new Date().toISOString()
      };

      // Get existing transactions or initialize new array
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.unshift(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setShowSuccess(true);
      
      // Navigate back to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, position: 'relative' }}>
      <BackButton />
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Send Money
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Recipient Name"
            name="recipientName"
            value={formData.recipientName}
            onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Recipient Phone Number"
            name="recipientPhone"
            value={formData.recipientPhone}
            onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
            disabled={loading}
            inputProps={{
              maxLength: 10,
              pattern: '[0-9]*'
            }}
            helperText="Enter 10-digit phone number"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            disabled={loading}
            inputProps={{
              maxLength: 12,
              pattern: '[0-9]*'
            }}
            helperText="Enter 10-12 digit account number"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            disabled={loading}
            InputProps={{
              startAdornment: '₹'
            }}
          />

          <CustomButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Money'}
          </CustomButton>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 1 }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog 
        open={showSuccess} 
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent>
          <Fade in={showSuccess}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <CheckCircle 
                color="success" 
                sx={{ fontSize: 60, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Transfer Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                ₹{formData.amount} has been sent to {formData.recipientName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Redirecting to dashboard...
              </Typography>
            </Box>
          </Fade>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default SendMoney;

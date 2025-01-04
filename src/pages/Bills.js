import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PhoneAndroid,
  LiveTv,
  WaterDrop,
  Lightbulb,
  NetworkWifi,
  LocalGasStation,
  Close
} from '@mui/icons-material';
import CustomButton from '../components/CustomButton';
import BackButton from '../components/BackButton';

const billTypes = [
  { id: 'mobile', name: 'Mobile Recharge', icon: PhoneAndroid, color: '#FF6B6B' },
  { id: 'dth', name: 'DTH/Cable TV', icon: LiveTv, color: '#4ECDC4' },
  { id: 'water', name: 'Water Bill', icon: WaterDrop, color: '#45B7D1' },
  { id: 'electricity', name: 'Electricity', icon: Lightbulb, color: '#96CEB4' },
  { id: 'broadband', name: 'Broadband', icon: NetworkWifi, color: '#FF9F1C' },
  { id: 'gas', name: 'Gas Bill', icon: LocalGasStation, color: '#D65780' }
];

const operators = {
  mobile: ['Airtel', 'Jio', 'Vi', 'BSNL'],
  dth: ['Tata Sky', 'Dish TV', 'Airtel DTH', 'Sun Direct'],
  water: ['City Water Board', 'Municipal Corporation'],
  electricity: ['State Electricity Board', 'City Power Supply'],
  broadband: ['Airtel', 'Jio Fiber', 'ACT', 'BSNL'],
  gas: ['HP Gas', 'Indane', 'Bharat Gas']
};

function Bills() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedBill, setSelectedBill] = useState(null);
  const [billData, setBillData] = useState({
    operator: '',
    number: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBillSelect = (billType) => {
    setSelectedBill(billType);
    setBillData({ operator: '', number: '', amount: '' });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Get current user's data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const amount = parseFloat(billData.amount);

      if (amount > currentUser.walletBalance) {
        throw new Error('Insufficient balance');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update balance
      const newBalance = currentUser.walletBalance - amount;
      currentUser.walletBalance = newBalance;
      localStorage.setItem('user', JSON.stringify(currentUser));

      // Create transaction record
      const transaction = {
        type: 'debit',
        amount: amount,
        category: selectedBill.name,
        operator: billData.operator,
        billNumber: billData.number,
        date: new Date().toISOString()
      };

      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      transactions.unshift(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setSuccess(true);
      setTimeout(() => {
        setSelectedBill(null);
        setSuccess(false);
        setBillData({ operator: '', number: '', amount: '' });
      }, 2000);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, position: 'relative' }}>
      <BackButton />
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Bills & Recharges
      </Typography>

      <Grid container spacing={2}>
        {billTypes.map((bill) => (
          <Grid item xs={6} sm={4} md={2} key={bill.id}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleBillSelect(bill)}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2
                }}
              >
                <Box
                  sx={{
                    backgroundColor: bill.color,
                    borderRadius: '50%',
                    p: 1,
                    mb: 1
                  }}
                >
                  <bill.icon sx={{ color: 'white' }} />
                </Box>
                <Typography 
                  variant="body2" 
                  align="center"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: isMobile ? '0.8rem' : '0.875rem'
                  }}
                >
                  {bill.name}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={!!selectedBill} 
        onClose={() => setSelectedBill(null)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        {selectedBill && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {selectedBill.name}
                <IconButton onClick={() => setSelectedBill(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Select Operator"
                  value={billData.operator}
                  onChange={(e) => setBillData({ ...billData, operator: e.target.value })}
                  SelectProps={{
                    native: true
                  }}
                  sx={{ mb: 2 }}
                >
                  <option value="">Select</option>
                  {operators[selectedBill.id].map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label={selectedBill.id === 'mobile' ? 'Mobile Number' : 'Consumer Number'}
                  value={billData.number}
                  onChange={(e) => setBillData({ ...billData, number: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={billData.amount}
                  onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
                  InputProps={{
                    startAdornment: '₹'
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <CustomButton 
                variant="contained" 
                fullWidth 
                onClick={handlePayment}
                disabled={loading || !billData.operator || !billData.number || !billData.amount}
                sx={{ 
                  height: '48px',
                  fontSize: '1rem'
                }}
              >
                {loading ? 'Processing...' : `Pay ₹${billData.amount || '0'}`}
              </CustomButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog 
        open={success} 
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent>
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
            <Typography variant="h6" color="success.main" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your {selectedBill?.name.toLowerCase()} payment was successful
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default Bills; 
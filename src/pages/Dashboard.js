import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/CustomButton';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(10000); // Initial balance set to 10000

  useEffect(() => {
    // Get transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);

    // Calculate current balance based on transactions
    const currentBalance = savedTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'credit') {
        return acc + parseFloat(transaction.amount);
      } else {
        return acc - parseFloat(transaction.amount);
      }
    }, 10000); // Start with initial balance of 10000

    setBalance(currentBalance);
    
    // Update user data with new balance
    const updatedUser = { ...user, walletBalance: currentBalance };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Wallet Balance
            </Typography>
            <Typography variant="h3" color="primary">
              ₹{balance.toFixed(2)}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <CustomButton 
                variant="contained" 
                fullWidth
                onClick={() => navigate('/send-money')}
                sx={{ mb: 1 }}
              >
                Send Money
              </CustomButton>
              <CustomButton 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/bills')}
              >
                Pay Bills
              </CustomButton>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/send-money')}
                  sx={{ height: '100%' }}
                >
                  Send Money
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/bills')}
                  sx={{ height: '100%' }}
                >
                  Pay Bills
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/transactions')}
                  sx={{ height: '100%' }}
                >
                  Transactions
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => navigate('/profile')}
                  sx={{ height: '100%' }}
                >
                  Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {transactions.length > 0 ? (
              <List>
                {transactions.slice(0, 5).map((transaction, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={transaction.type === 'credit' 
                          ? `Money Received from ${transaction.senderName || 'Unknown'}`
                          : `Sent to ${transaction.recipientName}`}
                        secondary={`${transaction.type === 'credit' 
                          ? transaction.senderPhone || '' 
                          : transaction.recipientPhone} • ${new Date(transaction.date).toLocaleString()}`}
                      />
                      <Typography 
                        variant="body2" 
                        color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </Typography>
                    </ListItem>
                    {index < transactions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No recent transactions
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;

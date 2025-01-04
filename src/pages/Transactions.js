import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip
} from '@mui/material';
import BackButton from '../components/BackButton';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [organizedTransactions, setOrganizedTransactions] = useState({
    today: [],
    yesterday: [],
    earlier: []
  });

  useEffect(() => {
    // Get transactions from localStorage
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(savedTransactions);

    // Organize transactions by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const organized = savedTransactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(0, 0, 0, 0);

      if (transactionDate.getTime() === today.getTime()) {
        acc.today.push(transaction);
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        acc.yesterday.push(transaction);
      } else {
        acc.earlier.push(transaction);
      }
      return acc;
    }, { today: [], yesterday: [], earlier: [] });

    setOrganizedTransactions(organized);
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const TransactionSection = ({ title, transactions, showDate = false }) => (
    transactions.length > 0 && (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            {title}
          </Typography>
          <Chip 
            label={`${transactions.length} transactions`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        <Paper elevation={3}>
          <List>
            {transactions.map((transaction, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {transaction.type === 'credit' 
                          ? 'Money Received' 
                          : `Sent to ${transaction.recipientName}`}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.recipientPhone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {showDate 
                            ? formatDate(transaction.date) 
                            : formatTime(transaction.date)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Typography 
                    variant="body1" 
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
        </Paper>
      </Box>
    )
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, position: 'relative' }}>
      <BackButton />
      <Typography variant="h4" gutterBottom>
        Transaction History
      </Typography>

      {transactions.length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No transactions yet
          </Typography>
        </Paper>
      ) : (
        <>
          <TransactionSection 
            title="Today's Transactions" 
            transactions={organizedTransactions.today} 
          />
          <TransactionSection 
            title="Yesterday's Transactions" 
            transactions={organizedTransactions.yesterday} 
          />
          <TransactionSection 
            title="Earlier Transactions" 
            transactions={organizedTransactions.earlier} 
            showDate={true}
          />
        </>
      )}
    </Container>
  );
}

export default Transactions; 
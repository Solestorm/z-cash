import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Person as PersonIcon, Security as SecurityIcon } from '@mui/icons-material';
import BackButton from '../components/BackButton';

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [editing, setEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    try {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    // In a real app, you'd verify the current password and update it in the backend
    setSuccess('Password updated successfully!');
    setChangePassword(false);
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  // Calculate total transactions
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    transactionCount: 0
  });

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const stats = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'debit') {
        acc.totalSent += parseFloat(transaction.amount);
      } else {
        acc.totalReceived += parseFloat(transaction.amount);
      }
      acc.transactionCount++;
      return acc;
    }, { totalSent: 0, totalReceived: 0, transactionCount: 0 });
    setStats(stats);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, position: 'relative' }}>
      <BackButton />
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h5">Profile Information</Typography>
            </Box>

            <Box component="form">
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
              />
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
              />

              <Box sx={{ mt: 2 }}>
                {editing ? (
                  <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
                    Save Changes
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleEdit} sx={{ mr: 1 }}>
                    Edit Profile
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<SecurityIcon />}
                  onClick={() => setChangePassword(true)}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Transaction Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Total Sent: ₹{stats.totalSent.toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total Received: ₹{stats.totalReceived.toFixed(2)}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">
                Total Transactions: {stats.transactionCount}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={changePassword} onClose={() => setChangePassword(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            margin="normal"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePassword(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;

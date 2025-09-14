// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // مسیر درست: /api/token/
      const response = await apiClient.post('/api/token/', {
        username: username,
        password: password,
      });

      // ذخیره توکن در localStorage
      localStorage.setItem('authToken', response.data.token);

      showNotification('ورود با موفقیت انجام شد!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      showNotification('نام کاربری یا رمز عبور اشتباه است.', 'error');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود به پنل مدیریت
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="نام کاربری"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="رمز عبور"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            ورود
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;

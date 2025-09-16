// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

function LoginPage() {
  // 🔹 مقادیر فرم
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 🔹 وضعیت لودینگ
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // استفاده از Context نوتیفیکیشن

  // 🔹 تابع ارسال فرم
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // شروع لودینگ
    try {
      // ارسال درخواست لاگین به SimpleJWT
      const response = await apiClient.post('/token/', {
        username,
        password,
      });

      // ذخیره توکن‌ها در localStorage
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      // نمایش نوتیفیکیشن موفقیت
      showNotification('ورود با موفقیت انجام شد! ✅', 'success');

      // هدایت به داشبورد
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      // نمایش نوتیفیکیشن خطا
      showNotification('نام کاربری یا رمز عبور اشتباه است.', 'error');
    } finally {
      setLoading(false); // پایان لودینگ
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
        {/* آواتار با آیکون */}
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        {/* عنوان صفحه */}
        <Typography component="h1" variant="h5">
          ورود به پنل مدیریت
        </Typography>

        {/* فرم لاگین */}
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

          {/* دکمه ورود */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading} // غیر فعال کردن هنگام لودینگ
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'ورود'
            )}
          </Button>
        </Box>

        {/* لینک فراموشی رمز عبور (اختیاری) */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            رمز عبور خود را فراموش کرده‌اید؟
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;

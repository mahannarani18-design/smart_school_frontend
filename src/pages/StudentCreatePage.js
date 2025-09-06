import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext'; // <-- وارد کردن هوک

function StudentCreatePage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    student_id: '',
    grade: '',
  });
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // <-- استفاده از هوک

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/profiles/students/create/', formData);
      showNotification('دانش‌آموز با موفقیت ساخته شد.'); // <-- نوتیفیکیشن موفقیت
      navigate('/students');
    } catch (err) {
      console.error('Failed to create student:', err);
      const errorMessage = err.response?.data?.username?.[0] || 'خطا در ساخت دانش‌آموز. لطفاً اطلاعات را بررسی کنید.';
      showNotification(errorMessage, 'error'); // <-- نوتیفیکیشن خطا
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>
        افزودن دانش‌آموز جدید
      </Typography>
      {/* دیگر به Alert نیازی نداریم */}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField name="username" label="نام کاربری" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="password" label="رمز عبور" type="password" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="first_name" label="نام" onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField name="last_name" label="نام خانوادگی" onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField name="student_id" label="شماره دانش‌آموزی" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="grade" label="پایه تحصیلی" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" size="large">
          ساخت دانش‌آموز
        </Button>
      </Box>
    </Container>
  );
}

export default StudentCreatePage;
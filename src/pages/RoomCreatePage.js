// مسیر: frontend/src/pages/RoomCreatePage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

function RoomCreatePage() {
  const [formData, setFormData] = useState({ room_number: '', floor: '', capacity: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/dormitory/rooms/', formData);
      navigate('/rooms');
    } catch (err) {
      setError('خطا در ساخت اتاق. لطفاً اطلاعات را بررسی کنید.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>افزودن اتاق جدید</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField name="room_number" label="شماره اتاق" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="floor" label="طبقه" type="number" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="capacity" label="ظرفیت" type="number" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="description" label="توضیحات" onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" size="large">ایجاد اتاق</Button>
      </Box>
    </Container>
  );
}
export default RoomCreatePage;
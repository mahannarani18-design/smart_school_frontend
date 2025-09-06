// مسیر: frontend/src/pages/TicketCreatePage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

function TicketCreatePage() {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/maintenance/tickets/', formData);
      navigate('/tickets');
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setError('خطا در ثبت تیکت. لطفاً تمام فیلدها را بررسی کنید.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>
        ثبت تیکت جدید
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField name="title" label="عنوان مشکل" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="description" label="شرح کامل مشکل" onChange={handleChange} fullWidth required multiline rows={4} sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="priority-label">اولویت</InputLabel>
          <Select
            labelId="priority-label"
            name="priority"
            value={formData.priority}
            label="اولویت"
            onChange={handleChange}
          >
            <MenuItem value={'LOW'}>پایین</MenuItem>
            <MenuItem value={'MEDIUM'}>متوسط</MenuItem>
            <MenuItem value={'HIGH'}>بالا</MenuItem>
          </Select>
        </FormControl>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" size="large">
          ارسال تیکت
        </Button>
      </Box>
    </Container>
  );
}

export default TicketCreatePage;
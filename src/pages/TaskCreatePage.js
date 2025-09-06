import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function TaskCreatePage() {
  const [formData, setFormData] = useState({ title: '', description: '', assigned_to: '', status: 'TODO', due_date: null });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // دریافت لیست کاربران برای منوی کشویی
    apiClient.get('/accounts/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.error("خطا در دریافت لیست کاربران", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, due_date: newDate ? newDate.toISOString().split('T')[0] : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/tasks/tasks/', formData);
      navigate('/tasks');
    } catch (err) {
      console.error('خطا در ساخت وظیفه:', err);
      setError('خطا در ثبت وظیفه. لطفاً تمام فیلدها را بررسی کنید.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ my: 4 }}>
          ثبت وظیفه جدید
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField name="title" label="عنوان وظیفه" onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
          <TextField name="description" label="توضیحات" onChange={handleChange} fullWidth multiline rows={4} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="assigned-to-label">محول شده به</InputLabel>
            <Select
              labelId="assigned-to-label"
              name="assigned_to"
              value={formData.assigned_to}
              label="محول شده به"
              onChange={handleChange}
              required
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="تاریخ سررسید"
            onChange={handleDateChange}
            sx={{ width: '100%', mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" size="large">
            ارسال وظیفه
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default TaskCreatePage;
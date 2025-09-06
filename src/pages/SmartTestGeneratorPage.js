// مسیر: frontend/src/pages/SmartTestGeneratorPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

function SmartTestGeneratorPage() {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    easy_count: 0,
    medium_count: 0,
    hard_count: 0,
  });
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    apiClient.get('/academics/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) || 0 });
  };

  const handleTextFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/academics/generate-smart-test/', formData);
      showNotification(response.data.message);
      navigate('/question-bank'); // یا به صفحه لیست آزمون‌ها که بعداً می‌سازیم
    } catch (err) {
      showNotification(err.response?.data?.error || 'خطا در ساخت آزمون.', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 4 }}>آزمون‌ساز هوشمند</Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField name="title" label="عنوان آزمون" onChange={handleTextFieldChange} fullWidth required sx={{ mb: 2 }} />
          <FormControl fullWidth required sx={{ mb: 2 }}>
            <InputLabel>درس</InputLabel>
            <Select name="subject" value={formData.subject} label="درس" onChange={handleTextFieldChange}>
              {subjects.map(sub => <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography sx={{ mb: 2 }}>تعداد سوالات بر اساس سطح دشواری:</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField name="easy_count" label="آسان" type="number" onChange={handleChange} fullWidth />
            <TextField name="medium_count" label="متوسط" type="number" onChange={handleChange} fullWidth />
            <TextField name="hard_count" label="دشوار" type="number" onChange={handleChange} fullWidth />
          </Box>
          <Button type="submit" variant="contained" size="large">ایجاد آزمون هوشمند</Button>
        </Box>
      </Paper>
    </Container>
  );
}
export default SmartTestGeneratorPage;
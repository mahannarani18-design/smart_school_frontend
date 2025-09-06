// مسیر: frontend/src/pages/RoomEditPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';

function RoomEditPage() {
  const [formData, setFormData] = useState({ room_number: '', floor: '', capacity: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    apiClient.get(`/dormitory/rooms/${id}/`)
      .then(res => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('خطا در دریافت اطلاعات اتاق.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.put(`/dormitory/rooms/${id}/`, formData);
      navigate('/rooms');
    } catch (err) {
      setError('خطا در ویرایش اتاق.');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>ویرایش اتاق</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField name="room_number" label="شماره اتاق" value={formData.room_number} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="floor" label="طبقه" type="number" value={formData.floor} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="capacity" label="ظرفیت" type="number" value={formData.capacity} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="description" label="توضیحات" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} sx={{ mb: 2 }} />
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" size="large">ذخیره تغییرات</Button>
      </Box>
    </Container>
  );
}
export default RoomEditPage;
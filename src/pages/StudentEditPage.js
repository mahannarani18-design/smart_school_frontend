import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext'; // <-- وارد کردن هوک

function StudentEditPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    student_id: '',
    grade: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification(); // <-- استفاده از هوک

  useEffect(() => {
    apiClient.get(`/profiles/students/${id}/`)
      .then(res => {
        const { user, student_id, grade } = res.data;
        setFormData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          student_id: student_id,
          grade: grade,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        showNotification('خطا در دریافت اطلاعات دانش‌آموز.', 'error');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch(`/profiles/students/${id}/update/`, formData);
      showNotification('تغییرات با موفقیت ذخیره شد.'); // <-- نوتیفیکیشن موفقیت
      navigate('/students');
    } catch (err) {
      console.error('Failed to update student:', err.response?.data);
      showNotification('خطا در ویرایش دانش‌آموز.', 'error'); // <-- نوتیفیکیشن خطا
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>
        ویرایش دانش‌آموز
      </Typography>
      {/* دیگر به Alert نیازی نداریم */}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField name="first_name" label="نام" value={formData.first_name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField name="last_name" label="نام خانوادگی" value={formData.last_name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField name="email" label="ایمیل" type="email" value={formData.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField name="student_id" label="شماره دانش‌آموزی" value={formData.student_id} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <TextField name="grade" label="پایه تحصیلی" value={formData.grade} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" size="large">
          ذخیره تغییرات
        </Button>
      </Box>
    </Container>
  );
}

export default StudentEditPage;
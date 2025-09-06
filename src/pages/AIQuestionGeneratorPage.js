import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

function AIQuestionGeneratorPage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    apiClient.get('/academics/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !selectedSubject) {
      showNotification('لطفاً هم درس و هم فایل را انتخاب کنید.', 'error');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subject', selectedSubject);

    try {
      const response = await apiClient.post('/academics/generate-questions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showNotification(response.data.message || 'سوالات با موفقیت تولید شدند.');
      navigate('/question-bank');
    } catch (error) {
      console.error('Failed to generate questions:', error);
      showNotification(error.response?.data?.error || 'خطا در تولید سوالات.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 4 }}>تولید سوال با هوش مصنوعی</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth required sx={{ mb: 3 }}>
          <InputLabel id="subject-label">ابتدا درس را انتخاب کنید</InputLabel>
          <Select
            labelId="subject-label"
            value={selectedSubject}
            label="ابتدا درس را انتخاب کنید"
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(sub => (
              <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mb: 3 }}
        >
          انتخاب فایل PDF
          <input type="file" hidden accept=".pdf" onChange={handleFileChange} />
        </Button>

        {selectedFile && <Typography sx={{ mb: 2 }}>فایل انتخاب شده: {selectedFile.name}</Typography>}
        
        {loading ? <CircularProgress sx={{ display: 'block', margin: 'auto' }} /> : (
          <Button type="submit" variant="contained" size="large" fullWidth disabled={!selectedFile || !selectedSubject}>
            شروع تولید سوالات
          </Button>
        )}
      </Box>
    </Container>
  );
}
export default AIQuestionGeneratorPage;
// مسیر: frontend/src/pages/QuestionCreatePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function QuestionCreatePage() {
  const [subjects, setSubjects] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [answers, setAnswers] = useState([
    { answer_text: '', is_correct: false },
    { answer_text: '', is_correct: false },
  ]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/academics/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, []);

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index].answer_text = event.target.value;
    setAnswers(newAnswers);
  };

  const handleCorrectAnswerChange = (index) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      is_correct: i === index,
    }));
    setAnswers(newAnswers);
  };

  const addAnswerField = () => {
    setAnswers([...answers, { answer_text: '', is_correct: false }]);
  };

  const removeAnswerField = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!answers.some(a => a.is_correct)) {
      setError('لطفاً یک پاسخ صحیح را مشخص کنید.');
      return;
    }
    try {
      const payload = {
        subject: subject,
        question_text: questionText,
        answers: answers.filter(a => a.answer_text.trim() !== ''),
      };
      await apiClient.post('/academics/questions/', payload);
      navigate('/question-bank');
    } catch (err) {
      setError('خطا در ثبت سوال. لطفاً اطلاعات را بررسی کنید.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 4 }}>افزودن سوال جدید به بانک سوالات</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth required sx={{ mb: 2 }}>
          <InputLabel id="subject-label">درس</InputLabel>
          <Select
            labelId="subject-label"
            value={subject}
            label="درس"
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map(sub => (
              <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="متن سوال" value={questionText} onChange={(e) => setQuestionText(e.target.value)} fullWidth required multiline rows={4} sx={{ mb: 2 }} />

        <Typography sx={{ mb: 1 }}>گزینه‌های پاسخ (گزینه صحیح را انتخاب کنید):</Typography>
        {answers.map((answer, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <Button 
              onClick={() => handleCorrectAnswerChange(index)}
              variant={answer.is_correct ? "contained" : "outlined"}
              color="success"
              sx={{ minWidth: '80px' }}
            >
              صحیح
            </Button>
            <TextField 
              label={`گزینه ${index + 1}`} 
              value={answer.answer_text} 
              onChange={(e) => handleAnswerChange(index, e)} 
              fullWidth 
              variant="outlined"
              size="small"
            />
            <IconButton onClick={() => removeAnswerField(index)} color="error">
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addAnswerField} sx={{ mt: 1 }}>
          افزودن گزینه
        </Button>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2, display: 'block' }}>
          ذخیره سوال
        </Button>
      </Box>
    </Container>
  );
}
export default QuestionCreatePage;
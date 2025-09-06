// مسیر: frontend/src/pages/QuestionEditPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem, IconButton, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNotification } from '../context/NotificationContext';

function QuestionEditPage() {
  const [subjects, setSubjects] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsRes = await apiClient.get('/academics/subjects/');
        const questionRes = await apiClient.get(`/academics/questions/${id}/`);
        setSubjects(subjectsRes.data);
        setQuestionText(questionRes.data.question_text);
        setSubject(questionRes.data.subject);
        setAnswers(questionRes.data.answers);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات سوال.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  const addAnswerField = () => setAnswers([...answers, { answer_text: '', is_correct: false }]);
  const removeAnswerField = (index) => setAnswers(answers.filter((_, i) => i !== index));

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
      await apiClient.put(`/academics/questions/${id}/`, payload);
      showNotification('سوال با موفقیت ویرایش شد.');
      navigate('/question-bank');
    } catch (err) {
      setError('خطا در ویرایش سوال.');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 4 }}>ویرایش سوال</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth required sx={{ mb: 2 }}>
          <InputLabel>درس</InputLabel>
          <Select value={subject} label="درس" onChange={(e) => setSubject(e.target.value)}>
            {subjects.map(sub => <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField label="متن سوال" value={questionText} onChange={(e) => setQuestionText(e.target.value)} fullWidth required multiline rows={4} sx={{ mb: 2 }} />
        <Typography sx={{ mb: 1 }}>گزینه‌های پاسخ:</Typography>
        {answers.map((answer, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <Button onClick={() => handleCorrectAnswerChange(index)} variant={answer.is_correct ? "contained" : "outlined"} color="success" sx={{ minWidth: '80px' }}>صحیح</Button>
            <TextField label={`گزینه ${index + 1}`} value={answer.answer_text} onChange={(e) => handleAnswerChange(index, e)} fullWidth variant="outlined" size="small" />
            <IconButton onClick={() => removeAnswerField(index)} color="error"><RemoveCircleOutlineIcon /></IconButton>
          </Box>
        ))}
        <Button startIcon={<AddCircleOutlineIcon />} onClick={addAnswerField} sx={{ mt: 1 }}>افزودن گزینه</Button>
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" size="large" sx={{ mt: 2, display: 'block' }}>ذخیره تغییرات</Button>
      </Box>
    </Container>
  );
}
export default QuestionEditPage;
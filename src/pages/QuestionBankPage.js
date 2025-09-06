// مسیر: frontend/src/pages/QuestionBankPage.js
import React, { useState, useEffect } from 'react';
// Paper را به این لیست اضافه کردیم
import { Box, Container, Typography, Button, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, IconButton, FormControl, InputLabel, Select, MenuItem, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

const difficultyOptions = { EASY: 'آسان', MEDIUM: 'متوسط', HARD: 'دشوار' };
const sourceOptions = { KONKUR: 'کنکور سراسری', GHALAMCHI: 'آزمون قلم‌چی', FINAL: 'امتحان نهایی', CUSTOM: 'تالیفی' };

function QuestionBankPage() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({ subject: '', difficulty: '', source: '' });
  const { showNotification } = useNotification();

  const fetchData = (filterParams = '') => {
    Promise.all([
      apiClient.get('/academics/subjects/'),
      apiClient.get(`/academics/questions/?${filterParams}`)
    ]).then(([subjectsRes, questionsRes]) => {
      setSubjects(subjectsRes.data);
      setQuestions(questionsRes.data);
    }).catch(error => {
      console.error("Failed to fetch data:", error);
      showNotification('خطا در دریافت اطلاعات از سرور.', 'error');
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.source) params.append('source', filters.source);
    fetchData(params.toString());
  };

  const handleDelete = async (id) => {
    if(window.confirm('آیا از حذف این سوال مطمئن هستید؟')) {
      try {
        await apiClient.delete(`/academics/questions/${id}/`);
        showNotification('سوال با موفقیت حذف شد.');
        applyFilters(); // داده‌ها را بر اساس فیلترهای فعلی دوباره بارگذاری کن
      } catch (error) {
        console.error("Failed to delete question:", error);
        showNotification('خطا در حذف سوال.', 'error');
      }
    }
  };

  const getQuestionsBySubject = (subjectId) => {
    return questions.filter(q => q.subject === subjectId);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>بانک سوالات</Typography>
        <Box>
          <Button component={Link} to="/question-bank/new" variant="contained" sx={{ mt: 4, ml: 1 }}>افزودن سوال دستی</Button>
          <Button component={Link} to="/question-bank/ai-generator" variant="outlined" sx={{ mt: 4 }}>ساخت با هوش مصنوعی</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>درس</InputLabel>
              <Select name="subject" value={filters.subject} label="درس" onChange={handleFilterChange}>
                <MenuItem value=""><em>همه دروس</em></MenuItem>
                {subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>سطح دشواری</InputLabel>
              <Select name="difficulty" value={filters.difficulty} label="سطح دشواری" onChange={handleFilterChange}>
                <MenuItem value=""><em>همه سطوح</em></MenuItem>
                {Object.entries(difficultyOptions).map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>منبع</InputLabel>
              <Select name="source" value={filters.source} label="منبع" onChange={handleFilterChange}>
                <MenuItem value=""><em>همه منابع</em></MenuItem>
                {Object.entries(sourceOptions).map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button onClick={applyFilters} variant="contained" fullWidth>اعمال فیلتر</Button>
          </Grid>
        </Grid>
      </Paper>

      {subjects.filter(s => getQuestionsBySubject(s.id).length > 0).map(subject => (
        <Accordion key={subject.id} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{subject.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {getQuestionsBySubject(subject.id).map(question => (
                <ListItem 
                  key={question.id}
                  secondaryAction={
                    <>
                      <IconButton component={Link} to={`/question-bank/${question.id}/edit`} edge="end" aria-label="ویرایش"><EditIcon /></IconButton>
                      <IconButton edge="end" aria-label="حذف" onClick={() => handleDelete(question.id)}><DeleteIcon /></IconButton>
                    </>
                  }
                >
                  <ListItemText 
                    primary={question.question_text}
                    secondary={
                      <Box component="ul" sx={{ pl: 2, m: 0, listStyleType: 'disc', fontSize: '0.9rem' }}>
                        {question.answers.map(ans => (
                          <Box component="li" key={ans.answer_text} sx={{ color: ans.is_correct ? '#66bb6a' : 'inherit', fontWeight: ans.is_correct ? 'bold' : 'normal' }}>
                            {ans.answer_text}
                          </Box>
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
export default QuestionBankPage;
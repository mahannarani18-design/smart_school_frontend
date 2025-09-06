// مسیر: frontend/src/pages/CheckInPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, List, ListItem, ListItemText, Button, CircularProgress, Paper } from '@mui/material';
import apiClient from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

function CheckInPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    apiClient.get('/profiles/students/')
      .then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch students:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const results = students.filter(student =>
      (student.user.first_name + " " + student.user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.includes(searchTerm)
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  const handleLogEvent = async (studentId, eventType) => {
    try {
      await apiClient.post('/attendance/log-event/', {
        student: studentId,
        event_type: eventType,
      });
      const studentName = students.find(s => s.id === studentId)?.user.first_name;
      const eventText = eventType === 'ENTRY' ? 'ورود' : 'خروج';
      showNotification(`${eventText} برای ${studentName} با موفقیت ثبت شد.`);
    } catch (error) {
      showNotification('خطا در ثبت تردد.', 'error');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>کیوسک ثبت تردد</Typography>
      <Paper sx={{ p: 2 }}>
        <TextField
          label="جستجوی دانش‌آموز (بر اساس نام یا شماره دانش‌آموزی)"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List sx={{ height: '60vh', overflowY: 'auto' }}>
          {filteredStudents.map(student => (
            <ListItem key={student.id} divider>
              <ListItemText 
                primary={`${student.user.first_name} ${student.user.last_name}`}
                secondary={`شماره دانش‌آموزی: ${student.student_id}`}
              />
              <Box>
                <Button variant="contained" color="success" onClick={() => handleLogEvent(student.id, 'ENTRY')} sx={{ ml: 1 }}>ورود</Button>
                <Button variant="outlined" color="error" onClick={() => handleLogEvent(student.id, 'EXIT')}>خروج</Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
export default CheckInPage;
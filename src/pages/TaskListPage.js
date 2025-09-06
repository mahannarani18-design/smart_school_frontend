// مسیر: frontend/src/pages/TaskListPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'عنوان', width: 300 },
  { field: 'status', headerName: 'وضعیت', width: 130 },
  { 
    field: 'assigned_to', 
    headerName: 'محول شده به', 
    width: 150,
    valueGetter: (value, row) => row.assigned_to?.username || 'نامشخص'
  },
  { field: 'due_date', headerName: 'تاریخ سررسید', width: 150 },
];

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tasks/tasks/')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch tasks:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>
          لیست وظایف
        </Typography>
        <Button component={Link} to="/tasks/new" variant="contained">
          ثبت وظیفه جدید
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>
    </Container>
  );
}
export default TaskListPage;
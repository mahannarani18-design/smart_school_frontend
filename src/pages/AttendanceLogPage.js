// مسیر: frontend/src/pages/AttendanceLogPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import apiClient from '../api/apiClient';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { 
    field: 'student', 
    headerName: 'دانش‌آموز', 
    width: 200, 
    valueGetter: (value, row) => `${row.student.user.first_name || ''} ${row.student.user.last_name || ''}`.trim() || row.student.user.username
  },
  { 
    field: 'event_type', 
    headerName: 'نوع تردد', 
    width: 130,
    valueGetter: (value) => value === 'ENTRY' ? 'ورود' : 'خروج'
  },
  { 
    field: 'timestamp', 
    headerName: 'زمان ثبت', 
    width: 200,
    valueGetter: (value) => new Date(value).toLocaleString('fa-IR')
  },
  { field: 'notes', headerName: 'یادداشت', width: 300, sortable: false },
];

function AttendanceLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/attendance/logs/')
      .then(response => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch attendance logs:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        گزارش کامل ترددها
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={logs}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }} // قابلیت فیلتر و خروجی اکسل
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </Container>
  );
}

export default AttendanceLogPage;
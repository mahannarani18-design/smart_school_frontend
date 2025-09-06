// مسیر: frontend/src/pages/TestResultListPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import apiClient from '../api/apiClient';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { 
    field: 'student', 
    headerName: 'دانش‌آموز', 
    width: 200, 
    valueGetter: (value, row) => `${row.student.user.first_name || ''} ${row.student.user.last_name || ''}`.trim() || row.student.user.username
  },
  { 
    field: 'test', 
    headerName: 'آزمون', 
    width: 250,
    valueGetter: (value, row) => row.test.title
  },
  { field: 'score', headerName: 'نمره', type: 'number', width: 100 },
  { 
    field: 'completed_at', 
    headerName: 'تاریخ', 
    width: 200,
    valueGetter: (value) => new Date(value).toLocaleString('fa-IR')
  },
];

function TestResultListPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/academics/results/')
      .then(response => {
        setResults(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch test results:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        نتایج آزمون‌ها
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={results}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </Container>
  );
}

export default TestResultListPage;
// مسیر: frontend/src/pages/TicketListPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'عنوان', width: 300 },
  { field: 'status', headerName: 'وضعیت', width: 130 },
  { field: 'priority', headerName: 'اولویت', width: 130 },
  { 
    field: 'reported_by', 
    headerName: 'گزارش دهنده', 
    width: 150,
    valueGetter: (value, row) => row.reported_by?.username || 'نامشخص'
  },
  { 
    field: 'created_at', 
    headerName: 'زمان ایجاد', 
    width: 200,
    valueGetter: (value) => new Date(value).toLocaleString('fa-IR')
  },
];

function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/maintenance/tickets/')
      .then(response => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch tickets:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>
          لیست تیکت‌های پشتیبانی
        </Typography>
        <Button component={Link} to="/tickets/new" variant="contained">
          ثبت تیکت جدید
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={tickets}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50]}
        />
      </Box>
    </Container>
  );
}

export default TicketListPage;
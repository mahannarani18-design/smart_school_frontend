// مسیر: frontend/src/pages/RoomListPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function RoomListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRooms = () => { /* ... کد fetchRooms بدون تغییر ... */ };
  useEffect(() => { fetchRooms() }, []);

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این اتاق مطمئن هستید؟')) {
      apiClient.delete(`/dormitory/rooms/${id}/`)
        .then(() => fetchRooms())
        .catch(error => console.error('Failed to delete room:', error));
    }
  };

  const columns = [
    // ... ستون‌های قبلی ...
    { field: 'capacity', headerName: 'ظرفیت کل', width: 130 },
    { field: 'assigned_students_count', headerName: 'تعداد ساکنین', width: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton component={Link} to={`/rooms/${params.row.id}/edit`}>
             <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>لیست اتاق‌ها</Typography>
        <Button component={Link} to="/rooms/new" variant="contained">افزودن اتاق</Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          onRowClick={(params) => navigate(`/rooms/${params.id}`)}
          sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
          // ... بقیه پراپرتی‌ها ...
        />
      </Box>
    </Container>
  );
}

export default RoomListPage;
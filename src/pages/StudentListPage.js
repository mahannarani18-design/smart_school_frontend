import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchStudents = () => {
    setLoading(true);
    apiClient.get('/profiles/students/')
      .then(response => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch students:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این دانش‌آموز مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) {
      apiClient.delete(`/profiles/students/${id}/delete/`)
        .then(() => fetchStudents())
        .catch(error => console.error('Failed to delete student:', error));
    }
  };
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'username', 
      headerName: 'نام کاربری', 
      width: 150, 
      valueGetter: (params) => params.row.user?.username || ''
    },
    { 
      field: 'full_name', 
      headerName: 'نام کامل', 
      width: 200, 
      valueGetter: (params) => `${params.row.user?.first_name || ''} ${params.row.user?.last_name || ''}`
    },
    { field: 'student_id', headerName: 'شماره دانش‌آموزی', width: 150 },
    { field: 'grade', headerName: 'پایه', width: 110 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton component={Link} to={`/students/${params.row.id}/edit`}>
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
        <Typography variant="h4" sx={{ mt: 4 }}>
          لیست دانش‌آموزان
        </Typography>
        <Button component={Link} to="/students/new" variant="contained" color="primary">
          افزودن دانش‌آموز
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={students}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          getRowId={(row) => row.id}
        />
      </Box>
    </Container>
  );
}

export default StudentListPage;

// File Path: frontend/src/pages/TestListPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, IconButton, Button, Paper } from '@mui/material'; // <-- Button is now imported
import { DataGrid } from '@mui/x-data-grid';
import { useReactToPrint } from 'react-to-print';
import apiClient from '../api/apiClient';
import PrintIcon from '@mui/icons-material/Print';
import PrintableTest from '../components/PrintableTest';

function TestListPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const printComponentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: `آزمون - ${selectedTest?.title}`
  });

  const fetchTestDataForPrint = (testId) => {
    // Find the basic test info from the list we already have
    const testInfo = tests.find(t => t.id === testId);
    // Fetch detailed info including questions
    apiClient.get(`/academics/tests/${testId}/`)
      .then(res => {
        // Combine basic info with detailed info
        setSelectedTest({ ...testInfo, ...res.data });
      })
      .catch(err => console.error("Failed to fetch test details", err));
  };

  // useEffect to trigger print once the detailed data is ready
  useEffect(() => {
    if (selectedTest && selectedTest.questions) {
      handlePrint();
    }
  }, [selectedTest, handlePrint]);

  // useEffect to fetch the list of all tests
  useEffect(() => {
    apiClient.get('/academics/tests/')
      .then(response => {
        setTests(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch tests:', error);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'عنوان آزمون', width: 400 },
    { 
      field: 'subject_name', 
      headerName: 'درس', 
      width: 200, 
      valueGetter: (value, row) => row.subject?.name 
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => fetchTestDataForPrint(params.row.id)}
        >
          چاپ آزمون
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        لیست آزمون‌ها
      </Typography>
      <Box component={Paper} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={tests}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
      {/* Hidden component for printing */}
      <div style={{ display: 'none' }}>
        {selectedTest && <PrintableTest ref={printComponentRef} test={selectedTest} questions={selectedTest.questions} />}
      </div>
    </Container>
  );
}

export default TestListPage;
// مسیر: frontend/src/pages/StudentDetailPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CircularProgress, Box, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import apiClient from '../api/apiClient';
import PrintableReportCard from '../components/PrintableReportCard';
import PrintIcon from '@mui/icons-material/Print';

function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `کارنامه - ${student?.user.first_name} ${student?.user.last_name}`
  });

  useEffect(() => {
    apiClient.get(`/profiles/students/${id}/`)
      .then(response => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch student details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!student) return <Typography>دانش‌آموز یافت نشد.</Typography>;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
          جزئیات پروفایل دانش‌آموز
        </Typography>
        <Button variant="contained" onClick={handlePrint} startIcon={<PrintIcon />}>
          چاپ کارنامه
        </Button>
      </Box>

      {/* کامپوننت قابل چاپ را به صورت مخفی در صفحه قرار می‌دهیم */}
      <div style={{ display: 'none' }}>
        <PrintableReportCard ref={componentRef} student={student} />
      </div>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {student.user.first_name} {student.user.last_name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            نام کاربری: {student.user.username}
          </Typography>
          <Box component="ul" sx={{ pl: 2, listStyle: 'none' }}>
            <li><Typography><strong>ایمیل:</strong> {student.user.email || 'ثبت نشده'}</Typography></li>
            <li><Typography><strong>شماره دانش‌آموزی:</strong> {student.student_id}</Typography></li>
            <li><Typography><strong>پایه:</strong> {student.grade}</Typography></li>
            <li><Typography><strong>اتاق:</strong> {student.room_number || 'تخصیص نیافته'}</Typography></li>
            <li><Typography><strong>امتیاز کل:</strong> {student.total_points}</Typography></li>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mb: 2 }}>
        کارنامه تحصیلی
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام آزمون</TableCell>
              <TableCell align="center">نمره</TableCell>
              <TableCell align="left">تاریخ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {student.testresult_set && student.testresult_set.length > 0 ? (
              student.testresult_set.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.test.title}</TableCell>
                  <TableCell align="center">{result.score}</TableCell>
                  <TableCell align="left">{new Date(result.completed_at).toLocaleDateString('fa-IR')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  هیچ نتیجه آزمونی برای این دانش‌آموز ثبت نشده است.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default StudentDetailPage;
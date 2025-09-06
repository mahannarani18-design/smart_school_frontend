// مسیر: frontend/src/components/PrintableReportCard.js
import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';

// از forwardRef استفاده می‌کنیم تا کامپوننت بتواند ref را از بیرون دریافت کند
const PrintableReportCard = React.forwardRef(({ student }, ref) => {
  if (!student) {
    return null; // اگر دانش‌آموز وجود نداشت، چیزی نمایش نده
  }

  return (
    <div ref={ref} style={{ padding: '30px', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      {/* سربرگ کارنامه */}
      <Box sx={{ textAlign: 'center', borderBottom: '2px solid black', pb: 2, mb: 4 }}>
        <Typography variant="h4" component="h1">کارنامه تحصیلی</Typography>
        <Typography variant="h6">مجتمع آموزشی موج امید ایرافشان</Typography>
      </Box>

      {/* اطلاعات دانش‌آموز */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
            <Typography><strong>نام و نام خانوادگی:</strong> {student.user.first_name} {student.user.last_name}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography><strong>شماره دانش‌آموزی:</strong> {student.student_id}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography><strong>پایه تحصیلی:</strong> {student.grade}</Typography>
        </Grid>
      </Grid>

      {/* جدول نمرات */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>نام آزمون</TableCell>
              <TableCell align="center">نمره کسب شده</TableCell>
              <TableCell align="left">تاریخ برگزاری</TableCell>
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
    </div>
  );
});

export default PrintableReportCard;
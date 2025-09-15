// frontend/src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Grid, CircularProgress, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import StatCard from '../components/StatCard';
import StudentsByGradeChart from '../components/charts/StudentsByGradeChart';

// Import کردن آیکون‌ها
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BuildIcon from '@mui/icons-material/Build';
import EventIcon from '@mui/icons-material/Event';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // استفاده از useCallback برای پایدار کردن تابع و جلوگیری از اجرای مجدد و غیرضروری useEffect
  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ارسال هر دو درخواست به صورت همزمان برای سرعت بیشتر
        const statsPromise = apiClient.get('/accounts/dashboard-stats/');
        const chartPromise = apiClient.get('/accounts/charts/students-by-grade/');
        
        const [statsResponse, chartResponse] = await Promise.all([statsPromise, chartPromise]);
        
        setStats(statsResponse.data);
        setChartData(chartResponse.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // افزودن handleLogout به آرایه وابستگی‌ها برای رفع هشدار
  }, [handleLogout]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mt: 4 }}>
          داشبورد اصلی
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 4 }}>
          خروج از سیستم
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* بخش کارت‌های آمار */}
          {stats && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="تعداد کل دانش‌آموزان" value={stats.student_count} icon={<GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="تعداد کل اتاق‌ها" value={stats.room_count} icon={<MeetingRoomIcon sx={{ fontSize: 40, color: 'secondary.main' }} />} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="تیکت‌های باز" value={stats.open_tickets_count} icon={<BuildIcon sx={{ fontSize: 40, color: 'error.main' }} />} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="رویدادهای پیش رو" value={stats.upcoming_events_count} icon={<EventIcon sx={{ fontSize: 40, color: 'success.main' }} />} />
              </Grid>
            </>
          )}

          {/* بخش نمودار */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '100%' }}>
              {chartData && chartData.length > 0 ? (
                <StudentsByGradeChart chartData={chartData} />
              ) : (
                <Typography>داده‌ای برای نمایش نمودار تعداد دانش‌آموزان به تفکیک پایه وجود ندارد.</Typography>
              )}
            </Paper>
          </Grid>

          {/* یک بخش خالی برای نمودارهای آینده */}
          <Grid item xs={12} md={4}>
             <Paper sx={{ p: 2, height: '100%' }}>
                <Typography>بخش دوم نمودارها</Typography>
             </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default DashboardPage;
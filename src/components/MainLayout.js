// مسیر: frontend/src/components/MainLayout.js
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RuleIcon from '@mui/icons-material/Rule';
import EventIcon from '@mui/icons-material/Event';
import BuildIcon from '@mui/icons-material/Build';
import TaskIcon from '@mui/icons-material/Task';
import PollIcon from '@mui/icons-material/Poll';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArticleIcon from '@mui/icons-material/Article';
import LoginIcon from '@mui/icons-material/Login';

const drawerWidth = 240;

const menuItems = [
  { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'دانش‌آموزان', icon: <PeopleIcon />, path: '/students' },
  { text: 'اتاق‌ها', icon: <MeetingRoomIcon />, path: '/rooms' },
  { text: 'حضور و غیاب', icon: <RuleIcon />, path: '/attendance' },
  { text: 'رویدادها', icon: <EventIcon />, path: '/events' },
  { text: 'پشتیبانی و تعمیرات', icon: <BuildIcon />, path: '/tickets' },
  { text: 'مدیریت وظایف', icon: <TaskIcon />, path: '/tasks' },
  { text: 'نظرسنجی‌ها', icon: <PollIcon />, path: '/surveys' },
  { text: 'نتایج آزمون‌ها', icon: <AssessmentIcon />, path: '/results' },
  { text: 'بانک سوالات', icon: <SchoolIcon />, path: '/question-bank' },
  { text: 'آزمون‌ساز هوشمند', icon: <AutoAwesomeIcon />, path: '/smart-test-generator' },
  { text: 'لیست آزمون‌ها', icon: <ArticleIcon />, path: '/tests' },
  { text: 'کیوسک تردد', icon: <LoginIcon />, path: '/check-in' },
];

function MainLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            مدیریت خوابگاه موج امید ایرافشان
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding component={Link} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
                <ListItemButton>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
// مسیر: frontend/src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl', // <-- جهت راست‌چین
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Vazirmatn, sans-serif', // <-- استفاده از فونت وزیرمتن
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
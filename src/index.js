// مسیر: frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+
import './index.css';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // برای Material UI
import theme from './theme/theme';

// کتابخانه‌های مورد نیاز برای RTL
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// تنظیم RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// ساخت ریشه
const root = ReactDOM.createRoot(document.getElementById('root'));

// رندر کردن برنامه
root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);

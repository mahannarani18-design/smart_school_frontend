// مسیر: frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // <-- این را وارد کنید
import theme from './theme/theme';

// کتابخانه‌های مورد نیاز برای RTL
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* <-- این کامپوننت را اینجا اضافه کنید */}
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
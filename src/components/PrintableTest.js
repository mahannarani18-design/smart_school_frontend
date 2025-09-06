// مسیر: frontend/src/components/PrintableTest.js
import React from 'react';
import { Box, Typography, Paper, Divider, Grid } from '@mui/material';

const PrintableTest = React.forwardRef(({ test }, ref) => {
  if (!test) return null;

  return (
    <div ref={ref} style={{ padding: '30px', direction: 'rtl', fontFamily: 'Vazirmatn' }}>
      <Paper elevation={0} sx={{ border: '2px solid black', p: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">آزمون {test.subject?.name}</Typography>
          <Typography variant="subtitle1">دبیرستان غیر دولتی موج امید ایرافشان</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container sx={{ mb: 3 }}>
          <Grid item xs={6}><Typography><strong>نام و نام خانوادگی:</strong> ....................................</Typography></Grid>
          <Grid item xs={3}><Typography><strong>کلاس:</strong> ..............</Typography></Grid>
          <Grid item xs={3}><Typography><strong>تاریخ:</strong> ..... / ..... / .....</Typography></Grid>
          <Grid item xs={12}><Typography><strong>عنوان آزمون:</strong> {test.title}</Typography></Grid>
        </Grid>

        {test.questions.map((q, index) => (
          <Box key={q.id} sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 'bold' }}>{index + 1}. {q.question_text}</Typography>
            {q.question_type === 'MC' && (
              <Box component="ol" type="A" sx={{ pr: 4, mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {q.answers.map(ans => (
                  <li key={ans.id}><Typography>{ans.answer_text}</Typography></li>
                ))}
              </Box>
            )}
            {q.question_type !== 'MC' && (
               <Box sx={{ mt: 2, borderBottom: '1px dotted #ccc', height: '80px' }}></Box>
            )}
          </Box>
        ))}
      </Paper>
    </div>
  );
});

export default PrintableTest;
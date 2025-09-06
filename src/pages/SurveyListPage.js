// مسیر: frontend/src/pages/SurveyListPage.js
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Card, CardContent, Button, CardActions } from '@mui/material';
import apiClient from '../api/apiClient';

function SurveyListPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/feedback/surveys/')
      .then(response => {
        setSurveys(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch surveys:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        نظرسنجی‌های فعال
      </Typography>
      <Box>
        {surveys.length > 0 ? (
          surveys.map(survey => (
            <Card key={survey.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {survey.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {survey.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">شرکت در نظرسنجی</Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography>در حال حاضر نظرسنجی فعالی وجود ندارد.</Typography>
        )}
      </Box>
    </Container>
  );
}

export default SurveyListPage;
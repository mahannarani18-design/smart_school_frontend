import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert } from '@mui/material';
import apiClient from '../api/apiClient';

function EventCard({ event }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const startTime = new Date(event.start_datetime).toLocaleString('fa-IR');

  const handleRegister = async () => {
    setError('');
    try {
      await apiClient.post('/events/register/', { event: event.id });
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration failed:", err.response?.data);
      setError(err.response?.data?.error || 'خطا در ثبت‌نام.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {event.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {startTime} - {event.location}
        </Typography>
        <Typography variant="body2">
          {event.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          onClick={handleRegister} 
          disabled={isRegistered}
          variant={isRegistered ? "outlined" : "contained"}
        >
          {isRegistered ? "ثبت‌نام شدید" : "ثبت‌نام"}
        </Button>
      </CardActions>
      {error && <Alert severity="error" sx={{ m: 1 }}>{error}</Alert>}
    </Card>
  );
}

function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/events/')
      .then(response => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch events:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        رویدادها و فعالیت‌ها
      </Typography>
      <Grid container spacing={3}>
        {events.length > 0 ? (
          events.map(event => (
            <Grid xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))
        ) : (
          <Typography sx={{m: 3}}>در حال حاضر رویداد فعالی برای نمایش وجود ندارد.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default EventListPage;
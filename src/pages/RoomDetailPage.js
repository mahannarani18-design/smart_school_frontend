// مسیر: frontend/src/pages/RoomDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CircularProgress, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import apiClient from '../api/apiClient';

function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/dormitory/rooms/${id}/`)
      .then(response => {
        setRoom(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch room details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!room) return <Typography>اتاق یافت نشد.</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        جزئیات اتاق: {room.room_number}
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography><strong>طبقه:</strong> {room.floor}</Typography>
          <Typography><strong>ظرفیت:</strong> {room.capacity} نفر</Typography>
          <Typography><strong>توضیحات:</strong> {room.description || 'ندارد'}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mb: 2 }}>
        لیست ساکنین
      </Typography>
      <Card>
        <List>
          {room.studentprofile_set.length > 0 ? (
            room.studentprofile_set.map((profile, index) => (
              <React.Fragment key={profile.id}>
                <ListItem>
                  <ListItemText 
                    primary={`${profile.user.first_name} ${profile.user.last_name}`} 
                    secondary={`شماره دانش‌آموزی: ${profile.student_id}`}
                  />
                </ListItem>
                {index < room.studentprofile_set.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="در حال حاضر هیچ دانش‌آموزی در این اتاق ساکن نیست." />
            </ListItem>
          )}
        </List>
      </Card>
    </Container>
  );
}

export default RoomDetailPage;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import StudentCreatePage from './pages/StudentCreatePage';
import StudentEditPage from './pages/StudentEditPage';
import RoomListPage from './pages/RoomListPage';
import RoomDetailPage from './pages/RoomDetailPage';
import RoomCreatePage from './pages/RoomCreatePage';
import RoomEditPage from './pages/RoomEditPage';
import AttendanceLogPage from './pages/AttendanceLogPage';
import EventListPage from './pages/EventListPage';
import TicketListPage from './pages/TicketListPage';
import TicketCreatePage from './pages/TicketCreatePage';
import TaskListPage from './pages/TaskListPage';
import TaskCreatePage from './pages/TaskCreatePage';
import TaskEditPage from './pages/TaskEditPage';
import SurveyListPage from './pages/SurveyListPage';
import SurveyDetailPage from './pages/SurveyDetailPage';
import TestResultListPage from './pages/TestResultListPage';
import QuestionBankPage from './pages/QuestionBankPage';
import QuestionCreatePage from './pages/QuestionCreatePage';
import QuestionEditPage from './pages/QuestionEditPage';
import SmartTestGeneratorPage from './pages/SmartTestGeneratorPage';
import TestListPage from './pages/TestListPage';
import CheckInPage from './pages/CheckInPage';
import MainLayout from './components/MainLayout';
import './App.css';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="students" element={<StudentListPage />} />
          <Route path="students/new" element={<StudentCreatePage />} />
          <Route path="students/:id/edit" element={<StudentEditPage />} />
          <Route path="students/:id" element={<StudentDetailPage />} />
          <Route path="rooms" element={<RoomListPage />} />
          <Route path="rooms/new" element={<RoomCreatePage />} />
          <Route path="rooms/:id/edit" element={<RoomEditPage />} />
          <Route path="rooms/:id" element={<RoomDetailPage />} />
          <Route path="attendance" element={<AttendanceLogPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="tickets" element={<TicketListPage />} />
          <Route path="tickets/new" element={<TicketCreatePage />} />
          <Route path="tasks" element={<TaskListPage />} />
          <Route path="tasks/new" element={<TaskCreatePage />} />
          <Route path="tasks/:id/edit" element={<TaskEditPage />} />
          <Route path="surveys" element={<SurveyListPage />} />
          <Route path="surveys/:id" element={<SurveyDetailPage />} />
          <Route path="results" element={<TestResultListPage />} />
          <Route path="question-bank" element={<QuestionBankPage />} />
          <Route path="question-bank/new" element={<QuestionCreatePage />} />
          <Route path="question-bank/:id/edit" element={<QuestionEditPage />} />
          <Route path="smart-test-generator" element={<SmartTestGeneratorPage />} />
          <Route path="tests" element={<TestListPage />} />
          <Route path="check-in" element={<CheckInPage />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
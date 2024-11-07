import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import AppContent from './AppContent';

export default function AppWrapper() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AppContent /> : <LoginPage />;
}
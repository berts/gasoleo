import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppWrapper from './components/AppWrapper';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppWrapper />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
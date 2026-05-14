import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ChatPage } from './pages/ChatPage/ChatPage';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import React from 'react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<ChatPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
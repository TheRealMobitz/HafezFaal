import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GhazalsList from './components/GhazalsList';
import GhazalDetail from './components/GhazalDetail';
import SearchPage from './components/SearchPage';
import QuotesList from './components/QuotesList';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ghazals" element={<GhazalsList />} />
              <Route path="/ghazal/:ghazalNumber" element={<GhazalDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/quotes" element={<QuotesList />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
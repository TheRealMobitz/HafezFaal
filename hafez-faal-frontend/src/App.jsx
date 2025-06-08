import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Layout from './components/Layout';

// Import your page components
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GhazalsList from './components/GhazalsList';
import GhazalDetail from './components/GhazalDetail';
import SearchPage from './components/SearchPage';
import QuotesList from './components/QuotesList';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Header />
              <Routes>
                {/* HomePage with lighter background for readability */}
                <Route 
                  path="/" 
                  element={
                    <Layout backgroundOpacity="40">
                      <HomePage />
                    </Layout>
                  } 
                />
                
                {/* Auth pages with standard background */}
                <Route 
                  path="/login" 
                  element={
                    <Layout>
                      <Login />
                    </Layout>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <Layout>
                      <Register />
                    </Layout>
                  } 
                />
                
                {/* Dashboard with prominent background */}
                <Route 
                  path="/dashboard" 
                  element={
                    <Layout backgroundOpacity="50">
                      <Dashboard />
                    </Layout>
                  } 
                />
                
                {/* Content pages with subtle background */}
                <Route 
                  path="/ghazals" 
                  element={
                    <Layout backgroundOpacity="70">
                      <GhazalsList />
                    </Layout>
                  } 
                />
                <Route 
                  path="/ghazal/:ghazalNumber" 
                  element={
                    <Layout backgroundOpacity="80">
                      <GhazalDetail />
                    </Layout>
                  } 
                />
                
                {/* Search and quotes with readable background */}
                <Route 
                  path="/search" 
                  element={
                    <Layout backgroundOpacity="70">
                      <SearchPage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/quotes" 
                  element={
                    <Layout backgroundOpacity="70">
                      <QuotesList />
                    </Layout>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
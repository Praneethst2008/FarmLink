import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import Marketplace from './components/buyer/Marketplace';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminCrops from './components/admin/AdminCrops';
import CropDetails from './components/buyer/CropDetails';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Farmer Routes */}
            <Route 
              path="/farmer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Buyer Routes */}
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute allowedRoles={['buyer', 'farmer']}>
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crop/:id" 
              element={
                <ProtectedRoute allowedRoles={['buyer', 'farmer']}>
                  <CropDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/crops" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCrops />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
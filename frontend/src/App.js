import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/user/Login';
import RegisterPage from './pages/user/Register';
import HomePage from './pages/user/Home';
import DetailPage from './pages/user/Detail';
import SearchPage from './pages/user/Search';
import WatchlistPage from './pages/user/Watchlist';
import AddMoviePage from './pages/user/AddMovie';

import ForgetPasswordPage from './pages/user/ForgetPassword';
import ResetPasswordPage from './pages/user/ResetPassword';
import EmailConfirmationPage from './pages/user/EmailConfirmation';

import MovieInputPage from './pages/admin/MovieInput';
import MovieValidatePage from './pages/admin/MovieValidate';
import DashboardPage from './pages/admin/Dashboard';
import CountriesPage from './pages/admin/Countries';
import AwardsPage from './pages/admin/Awards';
import GenresPage from './pages/admin/Genres';
import UsersPage from './pages/admin/Users';
import ActorPage from './pages/admin/Actor';
import CommentPage from './pages/admin/Comments';

import ProtectedRoute from './components/ProtectedRoute';

import "./styles/detail.css";
import "./styles/style.css";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Rute umum yang dapat diakses oleh semua pengguna (tidak punya role) */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/title/:title" element={<DetailPage />} />
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
        <Route path="/verify-email" element={<EmailConfirmationPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Rute yang hanya bisa diakses oleh user */}
        <Route path="/watchlist" element={<ProtectedRoute roleRequired="user"><WatchlistPage /></ProtectedRoute>} />
        <Route path="/add-movie" element={<ProtectedRoute roleRequired="user"><AddMoviePage /></ProtectedRoute>} />

        {/* Rute yang hanya bisa diakses oleh admin */}
        <Route path="/dashboard" element={<ProtectedRoute roleRequired="admin"><DashboardPage /></ProtectedRoute>} />
        <Route path="/movie-validate" element={<ProtectedRoute roleRequired="admin"><MovieValidatePage /></ProtectedRoute>} />
        <Route path="/movie-input" element={<ProtectedRoute roleRequired="admin"><MovieInputPage /></ProtectedRoute>} />
        <Route path="/countries" element={<ProtectedRoute roleRequired="admin"><CountriesPage /></ProtectedRoute>} />
        <Route path="/awards" element={<ProtectedRoute roleRequired="admin"><AwardsPage /></ProtectedRoute>} />
        <Route path="/genres" element={<ProtectedRoute roleRequired="admin"><GenresPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute roleRequired="admin"><UsersPage /></ProtectedRoute>} />
        <Route path="/actor" element={<ProtectedRoute roleRequired="admin"><ActorPage /></ProtectedRoute>} />
        <Route path="/comments" element={<ProtectedRoute roleRequired="admin"><CommentPage /></ProtectedRoute>} />
        
        
      </Routes>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/user/Login';
import RegisterPage from './pages/user/Register';
import DetailPage from "./pages/user/Detail";
import SearchPage from './pages/user/Search';
import WatchlistPage from './pages/user/Watchlist';
import AddMoviePage from './pages/user/AddMovie';

import PasswordResetPage from './pages/user/ResetPassword';
import NewPasswordPage from './pages/user/NewPassword';
import EmailConfirmationPage from './pages/user/EmailConfirmation';

import MovieInputPage from './pages/admin/MovieInput';
import DashboardPage from './pages/admin/Dashboard';
import CountriesPage from './pages/admin/Countries';
import AwardsPage from './pages/admin/Awards';
import GenresPage from './pages/admin/Genres';
import UsersPage from './pages/admin/Users';

import "./styles/detail.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/add-movie" element={<AddMoviePage />} />


        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        

        {/* CMS - Admin */}
        <Route path="/movie-input" element={<MovieInputPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/countries" element={<CountriesPage />} />
        <Route path="/awards" element={<AwardsPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/users" element={<UsersPage />} />

      </Routes>
    </Router>
  );
}

export default App;


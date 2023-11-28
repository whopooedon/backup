import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
// Import other components
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserUpdatePage from './components/UserUpdatePage';
import MapWithMarkers from './components/Mapbox';
import CulturePage from './components/Culture';
import Path from './components/Path';
import MyRoutes from './components/MyRoute';
import MyRouteView from './components/MyRouteView';
import Header from './include/Header';
import MyPage from './components/MyPage';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap your components with AuthProvider */}
        <Header /> {/* Removed isLoggedIn and setIsLoggedIn props */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/userupdate" element={<UserUpdatePage />} />
          <Route path="/mapbox" element={<MapWithMarkers />} />
          <Route path="/culture/:bike_addr1/:longitude/:latitude" element={<CulturePage />} />
          <Route path="/path" element={<Path />} />
          <Route path="/myroute" element={<MyRoutes />} />
          <Route path="/route-view" element={<MyRouteView />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

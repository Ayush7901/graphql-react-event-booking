import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import { useContext } from 'react';
import AuthContext from './context/auth-context';
function App() {
  const authContext = useContext(AuthContext);
  return (
    <BrowserRouter>
      <MainNavigation />

      <main className="main-content">
        <Routes>
          {!authContext.authState.token && <Route path="/" element={<Navigate replace to="/auth" />} />}
          {!authContext.authState.token && <Route path="/bookings" element={<Navigate replace to="/auth" />} />}
          {authContext.authState.token && <Route path="/" element={<Navigate replace to="/events" />} />}
          {authContext.authState.token && <Route path="/auth" element={<Navigate replace to="/events" />} />}
          {!authContext.authState.token && <Route path="/auth" element={<AuthPage />} />}
          <Route path="/events" element={<EventsPage />} />
          {authContext.authState.token && <Route path="/bookings" element={<BookingsPage />} />}
        </Routes>
      </main>



    </BrowserRouter>

  );
}

export default App;

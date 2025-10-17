import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from './firebase/config';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [userProfile, setUserProfile] = React.useState(null);
  const [databaseError, setDatabaseError] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Check if user has completed onboarding
        try {
          const profileRef = ref(database, `profiles/${user.uid}`);
          const snapshot = await get(profileRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          } else {
            setUserProfile(null); // No profile, needs onboarding
          }
          setDatabaseError(false);
        } catch (error) {
          console.error('Error checking profile:', error);
          setDatabaseError(true);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
        setDatabaseError(false);
      }

      setLoading(false);
    });

    // Add a small delay to ensure Firebase is properly initialized
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Firebase initialization taking longer than expected');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--background-gradient)',
        color: 'var(--text-primary)',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2em',
            marginBottom: '20px',
            color: 'var(--secondary-color)'
          }}>
            🌙
          </div>
          <div>Loading Lunexa AI...</div>
          {databaseError && (
            <div style={{
              marginTop: '20px',
              color: '#ff6b6b',
              fontSize: '0.9em'
            }}>
              ⚠️ Connection issues detected. Some features may be limited.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={userProfile ? "/dashboard" : "/onboarding"} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={userProfile ? "/dashboard" : "/onboarding"} /> : <Register />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user && userProfile ? <Dashboard /> : <Navigate to={user ? "/onboarding" : "/login"} />} />
        <Route path="/settings" element={user && userProfile ? <Settings /> : <Navigate to={user ? "/onboarding" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

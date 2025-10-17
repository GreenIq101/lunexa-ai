import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
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

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Check if user has completed onboarding
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile(null); // No profile, needs onboarding
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          // Don't set userProfile to null on error, keep trying
          // This prevents infinite loops when Firestore is temporarily unavailable
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });
    return unsubscribe;
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

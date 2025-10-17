import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, disableNetwork, enableNetwork } from 'firebase/firestore';
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
  const [firestoreError, setFirestoreError] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Check if user has completed onboarding
        try {
          // Try to enable network if it was disabled
          await enableNetwork(db);

          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile(null); // No profile, needs onboarding
          }
          setFirestoreError(false);
        } catch (error) {
          console.error('Error checking profile:', error);
          setFirestoreError(true);
          // If Firestore is having issues, disable network to stop reconnection attempts
          try {
            await disableNetwork(db);
          } catch (disableError) {
            console.error('Error disabling network:', disableError);
          }
          // For onboarding, we can proceed without Firestore data
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
        setFirestoreError(false);
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
          {firestoreError && (
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

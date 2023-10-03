import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './utils/Firebase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigate(location.state?.from || '/', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate, location]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate(location.state?.from || '/', { replace: true });
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div>
      <h1>Welcome to Bored Gamer</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;

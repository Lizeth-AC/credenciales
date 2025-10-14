import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const SessionGuard = ({ children }) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('token_expiry');

    const isExpired = !token || !expiry || new Date() > new Date(expiry);

    if (isExpired) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/Login'); // 👈 usa replace en lugar de href
    } else {
      setChecking(false); // ✅ todo está bien, permite renderizar
    }
  }, []);

  if (checking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return children;
};

export default SessionGuard;
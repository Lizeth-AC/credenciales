import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' });

  const showAlert = (message, severity = 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorEmail('');
    setErrorPassword('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Inicio de sesión exitoso', 'success');

        const token = data.token;
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        localStorage.setItem('token', token);
        localStorage.setItem('token_expiry', expiry.toISOString());

        setTimeout(() => {
          navigate('/Inicio', { replace: true });
        }, 1000);
      }else {
        // Errores específicos
        if (data.errors) {
          if (data.errors.email) setErrorEmail(data.errors.email[0]);
          if (data.errors.password) setErrorPassword(data.errors.password[0]);
        } else if (data.field === 'email') {
          setErrorEmail(data.message || 'Correo electrónico incorrecto');
        } else if (data.field === 'password') {
          setErrorPassword(data.message || 'Contraseña incorrecta');
        } else {
          showAlert(data.message || 'Error en las credenciales');
        }
      }
    } catch (err) {
      console.error(err);
      showAlert('Error en la conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      padding={1}
      margin={1}
      minHeight={'95vh'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={3}
        style={{
          borderRadius: '15px',
          backgroundColor: '#f9f9f9',
          width: '100%',
          maxWidth: 400,
          padding: '30px',
        }}
      >
        <Grid container spacing={0.5} flexDirection="row" justifyContent={'center'} mb={2}>
          <img src={`/TEDLogo.png`} alt="Logo TED" style={{ width: '50px' }} />
          <Box backgroundColor="primary.main" width="1.5px" />
          <img src={`/EleccionesLogo.png`} alt="Logo Elecciones" style={{ width: '90px' }} />
        </Grid>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              error={!!errorEmail}
              helperText={errorEmail}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '3px 3px 6px #c1c1c1, -3px -3px 6px #ffffff',
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              error={!!errorPassword}
              helperText={errorPassword}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '3px 3px 6px #c1c1c1, -3px -3px 6px #ffffff',
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                boxShadow: '3px 3px 6px #c1c1c1, -3px -3px 6px #ffffff',
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Snackbar para mensajes generales */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} onClose={handleCloseAlert} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default Login;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function AccesoComputo() {
  const { token: tokenFromParams } = useParams();
  const [search] = useSearchParams();
  const tokenFromQuery = search.get('token');
  const token = tokenFromParams || tokenFromQuery;
  const navigate = useNavigate();
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasCalled = useRef(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const speakText = (text) => {
    try {
      if (!text) return;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('speechSynthesis no disponible', e);
    }
  };

  useEffect(() => {
    if (respuesta?.msg) speakText(respuesta.msg);
    return () => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (_) {}
    };
  }, [respuesta?.msg]);

  // ---- Llamada inicial ----
  useEffect(() => {
    if (token && !hasCalled.current) {
      registrarAcceso(token);
      hasCalled.current = true;
    }
  }, [token]);

  // ---- Progreso visual mientras carga ----
  useEffect(() => {
    if (loading) {
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          // Deja al 95% hasta que termine el fetch
          if (prev >= 95) return 95;
          return prev + 5;
        });
      }, 200);
    } else {
      // Completa a 100% cuando termina
      setProgress(100);
      clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [loading]);

  const registrarAcceso = async (tokenParam) => {
    setLoading(true);
    setError(null);
    setRespuesta(null);

    // Timeout manual (por si el WebView se queda colgado)
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/registro-acceso/registrar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenParam }),
          signal: controller.signal,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Error al registrar acceso');
      } else {
        setRespuesta(data);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Tiempo de espera agotado. Intente nuevamente.');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      clearTimeout(id);
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
          height: '100%',
          maxWidth: 600,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box mb={1} mt={1} ml={1}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Atrás</Button>
        </Box>
        {loading && (
          <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 2,
            position: 'relative',
          }}
          >
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={4}
            />
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                color: 'black',
              }}
            >
              {`${progress}%`}
            </Typography>
          </Box>
        )}

        {error && (
          <Typography
            variant="body1"
            align="center"
            style={{ color: 'red', marginBottom: 8 }}
          >
            {error}
          </Typography>
        )}

        {respuesta && (
          <Box padding={1} style={{ textAlign: 'center' }}>
            <Box
              marginBottom={1}
              backgroundColor={
                respuesta.tipo === 'entrada' ? '#1AB394' : '#F8AC59'
              }
              padding={2}
              borderRadius={3}
            >
              <Typography
                color="#FFFFFF"
                sx={{ fontWeight: 'bold', letterSpacing: 3 }}
              >
                {`${respuesta.personal.nombre} ${respuesta.personal.paterno} ${respuesta.personal.materno}`}
              </Typography>

              {respuesta.personal.photo && (
                <img
                  src={`data:image/jpeg;base64,${respuesta.personal.photo}`}
                  alt="Foto del personal"
                  style={{
                    width: '150px',
                    borderRadius: '10px',
                    marginTop: '5px',
                  }}
                />
              )}

              <Box
                marginTop={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                color="#FFFFFF"
              >
                <Typography variant="body1">
                  <strong>CI: </strong>
                  {`${respuesta.personal.ci} ${respuesta.personal.complemento || ''}`}
                </Typography>
                <Typography variant="body1">
                  {respuesta.personal.cargo_nombre}
                </Typography>
              </Box>
            </Box>

            <Grid
              container
              spacing={0.5}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid container spacing={0.5} flexDirection="row">
                <img
                  src={`/TEDLogo.jpg`}
                  alt="Logo TED"
                  style={{ width: '70px', height: '100%' }}
                />
                <Box backgroundColor="primary.main" width="1.5px"></Box>
                <img
                  src={`/EleccionesLogo.png`}
                  alt="Logo TED"
                  style={{ width: '90px', height: '100%' }}
                />
              </Grid>

              <Grid container spacing={0.5} flexDirection="row" color="#FFFFFF">
                <Box
                  backgroundColor={
                    respuesta.tipo === 'entrada' ? '#1AB394' : '#F8AC59'
                  }
                  padding={1}
                  borderRadius={2}
                  height="100%"
                  mr={1}
                >
                  <CalendarMonthIcon />
                  <Typography variant="body1">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Box
                  backgroundColor={
                    respuesta.tipo === 'entrada' ? '#1AB394' : '#F8AC59'
                  }
                  padding={1}
                  borderRadius={2}
                  height="100%"
                >
                  <AccessAlarmsIcon />
                  <Typography variant="body1">
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Grid>
  );
}

export default AccesoComputo;

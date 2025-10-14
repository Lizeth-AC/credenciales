import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
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
import FormularioObservador from '../components/organisms/FormularioObservador'; 

function AccesoObservador() {
  const { token } = useParams();
  const navigate = useNavigate();
  const cleanToken = token?.replace(/^externo-/, '');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipo_credencial, setTipo_credencial] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const hasCalled = useRef(false);
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
    if (datos?.msg) speakText(datos.msg);

    if (token && !hasCalled.current) {
      consultarAcceso(cleanToken);
      hasCalled.current = true;
    }

    return () => {
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch (_) {}
    };
  }, [datos?.msg, token]);

  const consultarAcceso = async (tokenParam) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('token', "externo-" + tokenParam); 

      const res = await fetch(`${import.meta.env.VITE_API_URL}/registro-acceso/registrar`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.res === false && data.status === 404) {
        setMostrarFormulario(true);
        setTipo_credencial(data.tipo_credencial);
      } else if (data.res === true) {
        setDatos(data);
      } else {
        setError(data.msg || 'Error desconocido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const registrarDatos = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('nombre_completo', formData.nombre_completo);
      body.append('ci', formData.ci);
      body.append('identificador', formData.identificador);
      body.append('organizacion_politica', formData.organizacion_politica);
      if (formData.foto) body.append('foto', formData.foto);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/activarQr/${cleanToken}`, {
        method: 'POST',
        body,
      });

      const data = await res.json();

      if (data.res === true) {
        setDatos(data);
        setMostrarFormulario(false);
      } else {
        setError(data.msg || 'Error al registrar');
      }
    } catch (err) {
      setError('Error al enviar datos');
    } finally {
      setLoading(false);
    }
  };

  const colorFondo = datos?.tipo === 'entrada' ? '#1AB394' : '#F8AC59';

  const eliminarDatos = async () => {
    const token = datos?.observador?.token_acceso;

    if (!token) {
      setAlert({ open: true, message: "No se encontró el token del registro", severity: "error" });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/liberarToken/${token}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.res === true) {
        setAlert({ open: true, message: data.msg, severity: "success" });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setAlert({ open: true, message: data.msg || "Error al eliminar", severity: "error" });
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      setAlert({ open: true, message: "Error al eliminar Personal", severity: "error" });
    }
  };
  return (
    <Grid padding={2} minHeight="95vh" display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={3} style={{ borderRadius: 15, padding: 20, maxWidth: 600, width: '100%' }}>
        <Box mb={2}>
          <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mr: 1 }}>Atrás</Button>
          {!mostrarFormulario && (
            <Button variant="outlined" onClick={() => eliminarDatos()}>Eliminar Datos</Button>
          )}
          
        </Box>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}

        {mostrarFormulario && (
          <FormularioObservador onSubmit={registrarDatos} loading={loading} tipo={tipo_credencial} celular={true}/>
        )}

        {datos && (
          <Box textAlign="center">
            <Box
              marginBottom={2}
              backgroundColor={colorFondo}
              padding={2}
              borderRadius={3}
              color="#FFFFFF"
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                {datos?.nombre_completo}
              </Typography>
              <Typography><strong>CI:</strong> {datos.observador.ci}</Typography>
              <img
                src={
                  datos.observador.foto
                    ? `data:image/jpeg;base64,${datos.observador.foto}`
                    : `/IconoPerfil.jpg`
                }
                alt="Foto del personal"
                style={{
                  width: '150px',
                  borderRadius: '10px',
                  marginTop: '5px',
                }}
              />
              <Typography><strong>Nombre Completo:</strong> {datos.observador.nombre_completo}</Typography>
              <Typography>
                {datos.observador.tipo === "delegado" || datos.observador.tipo === "candidato" || datos.observador.tipo === "observador"? (
                  <>
                    <strong>Organización:</strong> {datos.observador.organizacion_politica}
                  </>
                ) : datos.observador.tipo === "prensa" ? (
                  <>
                    <strong>Identificador:</strong> {datos.observador.identificador}
                  </>
                ) : null}
              </Typography>
              <Typography><strong>Tipo:</strong> {datos.observador.tipo}</Typography>
            </Box>

            <Grid container justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1} backgroundColor={colorFondo} padding={1} borderRadius={2} color="#FFFFFF">
                <CalendarMonthIcon />
                <Typography>{new Date().toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} backgroundColor={colorFondo} padding={1} borderRadius={2} color="#FFFFFF">
                <AccessAlarmsIcon />
                <Typography>{new Date().toLocaleTimeString()}</Typography>
              </Box>
            </Grid>
          </Box>
        )}
      </Paper>
    </Grid>
  );
}

export default AccesoObservador;
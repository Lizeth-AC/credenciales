import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import CustomSendIcon from '../../components/atoms/CustomSendIcon';

// Evita llamar la variable "alert", para no chocar con el alert() global del navegador
const GestionarExterno = () => {
  const [cargoSeleccionado, setCargoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [alerta, setAlerta] = useState({ open: false, message: '', severity: '' });
  const accesosGenerados = useRef([]);

  const chunkArray = (array, size = 9) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const handleChangeCargo = (event) => setCargoSeleccionado(event.target.value);

  const handleEnviar = async () => {
    if (!cantidad || !cargoSeleccionado) {
      return setAlerta({ open: true, message: "Debe completar todos los campos", severity: "error" });
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generar-accesos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          tipo: cargoSeleccionado,
          cantidad: Number(cantidad)
        })
      });

      if (!response.ok) throw new Error('Error al enviar los datos');

      const data = await response.json();

      if (!data.res || !Array.isArray(data.datos)) {
        setAlerta({ open: true, message: "La API no devolvió un array válido", severity: "error" });
        return;
      }

      accesosGenerados.current = data.datos;
      setCargoSeleccionado('');
      setCantidad('');

      setAlerta({ open: true, message: "Accesos generados correctamente", severity: "success" });
    } catch (error) {
      console.error(error);
      setAlerta({ open: true, message: "Error al cargar datos", severity: "error" });
    }
  };

  const abrirPreview = useCallback((array) => {
    if (!array?.length) {
      setAlerta({ open: true, message: "No hay datos para mostrar", severity: "warning" });
      return;
    }

    localStorage.setItem("credenciales_preview_pages", JSON.stringify(chunkArray(array, 9)));
    localStorage.setItem("credenciales_preview_acceso", 0);
    localStorage.setItem("credenciales_preview_ids", JSON.stringify(array.map(d => d.qr || d.barcode)));

    window.open("/preview", "_blank", "width=900,height=1400");
  }, [setAlerta]);

  const handlePrevisualizar = async () => {
    try {
      const query = new URLSearchParams();
      if (cargoSeleccionado) query.append("tipo", cargoSeleccionado);
      if (cantidad) query.append("cantidad", cantidad);
  
      const url = `${import.meta.env.VITE_API_URL}/acceso-externo/listar${
        query.toString() ? `?${query.toString()}` : ''
      }`;
  
      const resp = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
  
      if (!resp.ok) throw new Error("Error al obtener datos");
  
      const data = await resp.json();
      const personsArray = Array.isArray(data) ? data : data.datos;
  
      if (!Array.isArray(personsArray) || personsArray.length === 0) {
        setAlerta({
          open: true,
          message: "No se encontraron credenciales para esta selección",
          severity: "warning"
        });
        return;
      }
  
      abrirPreview(personsArray);
      setCargoSeleccionado('');
      setCantidad('');
      setAlerta({
        open: true,
        message: "Vista previa generada correctamente",
        severity: "success"
      });
    } catch (error) {
      console.error(error);
      setAlerta({
        open: true,
        message: "Error al obtener los datos para previsualizar",
        severity: "error"
      });
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Generar Credenciales
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Grid container spacing={2}>
            <Box sx={{ display: 'grid', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: 200 }}>Cantidad de Credenciales:</Typography>
              <Typography sx={{ width: 200 }}>Cargo Externo:</Typography>
            </Box>

            <Box sx={{ display: 'grid', alignItems: 'center', gap: 2, width: 400 }}>
              <TextField
                fullWidth
                placeholder="Cantidad"
                variant="outlined"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="cargo-label">Cargo Externo</InputLabel>
                <Select
                  labelId="cargo-label"
                  value={cargoSeleccionado}
                  label="Cargo Externo"
                  onChange={handleChangeCargo}
                >
                  <MenuItem value="prensa">Prensa</MenuItem>
                  <MenuItem value="observador">Observador</MenuItem>
                  <MenuItem value="candidato">Candidato</MenuItem>
                  <MenuItem value="delegado">Delegado</MenuItem>
                  <MenuItem value="publico">Público General</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', alignItems: 'center', gap: 2, width: 150 }}>
              <CustomSendIcon onClick={handleEnviar} />
              <Button
                variant="outlined"
                onClick={handlePrevisualizar}
                size="small"
                sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
              >
                Previsualizar
              </Button>
            </Box>
          </Grid>
        </Box>
      </Box>
      {alerta.open && (
  <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
    <Alert
      severity={alerta.severity}
      onClose={() => setAlerta({ ...alerta, open: false })}
      variant="filled"
      sx={{ width: '100%' }}
    >
      {alerta.message}
    </Alert>
  </Box>
)}

    </Box>
  );
};

export default GestionarExterno;

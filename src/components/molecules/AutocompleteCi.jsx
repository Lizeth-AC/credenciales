import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";

const AutocompleteCi = ({ fetchData, setResultadosFiltrados, accesoComputo, setAccesoComputo}) => {
  const [opciones, setOpciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    obtenerPersonal();
  }, []);

  const obtenerPersonal = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personalCI`, {
          headers: { 'Content-Type': 'application/json' },
        });
      const data = await response.json();
      const ci = data.personal.map(item => item.ci);
      setOpciones(ci);
    } catch (error) {
      console.error("Error al obtener personal:", error);
      showAlert("Error al cargar la lista de CI", "error");
    }
  };

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };
  const closeAlert = () => setAlert({ ...alert, open: false });

  const handleBuscar = async () => {   // 👈 ya no recibe accesoValue
    if (seleccionados.length === 0) return;
    setLoading(true);

    const params = new URLSearchParams();
    seleccionados.forEach(ci => params.append('personal[]', ci));
    
    // 👇 Usar directamente la prop accesoComputo
    if (accesoComputo === 1) params.append('accesoComputo', 1);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/list/personal-filter?${params.toString()}`);
      const data = await res.json();
      if (data.res && Array.isArray(data.personal)) {
        setResultadosFiltrados(data.personal);
        setAccesoComputo(accesoComputo);  
      } else {
        showAlert("No se encontraron resultados.", "warning");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error al buscar detalles.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={closeAlert}>
        <Alert severity={alert.severity} onClose={closeAlert} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      <Autocomplete
        multiple
        options={opciones}
        value={seleccionados}
        onChange={(e, newValue) => setSeleccionados(newValue)}
        filterSelectedOptions
        renderTags={(value, getTagProps) =>
          value.map((numero, index) => {
            const { key, ...chipProps } = getTagProps({ index });
            return <Chip key={key} label={numero} {...chipProps} />;
          })
        }
        renderInput={(params) => (
          <TextField {...params} label="Selecciona CI" placeholder="Buscar..." />
        )}
      />

      <Button
        onClick={handleBuscar}   // 👈 ya no le pasas nada
        variant="contained"
        sx={{ mt: 2 }}
        disabled={seleccionados.length === 0 || loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Buscar detalles"}
      </Button>
    </Box>
  );
};

export default AutocompleteCi;
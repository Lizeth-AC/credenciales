import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

import CustomTable from '../../components/organisms/CustomTable';
import CustomDeleteIcon from '../../components/atoms/CustomDeleteIcon';
import AddUnidadModalWrapper from '../../components/organisms/AddUnidadModalWrapper';
import CustomFormCargo from '../../components/organisms/CustomFormCargo';
import EditUnidadModal from '../../components/organisms/EditUnidadModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const GestionarUnidad = () => {
  const [filtroGeneral, setFiltroGeneral] = useState('');
  const [unidad, setUnidad] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [dialog, setDialog] = useState({ open: false, id: null });

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDialog = (id) => {
    setDialog({ open: true, id });
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, id: null });
  };

  const eliminarUnidad = async (id, onDeleteSuccess) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/secciones/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (response.ok && res.res) {
        showAlert('Unidad eliminada exitosamente', 'success');
        if (onDeleteSuccess) onDeleteSuccess();
      } else {
        showAlert(res.msg || 'No se pudo eliminar', 'error');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      showAlert('Hubo un error inesperado', 'error');
    }
  };

  const eliminarUnidadDeLista = (id) => {
    setUnidad((prev) => prev.filter((unidad) => unidad.id !== id));
  };

  useEffect(() => {
    obtenerListaUnidad();
  }, []);

  const obtenerListaUnidad = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/secciones`);
      if (!response.ok) throw new Error('Error al obtener la lista de secciones');
      const data = await response.json();
      setUnidad(data);
    } catch (error) {
      console.error('Error al obtener secciones:', error);
    }
  };

  const columns = [
    { id: 'nombre', label: 'Nombre Unidad', width: 180 },
    { id: 'abreviatura', label: 'Abreviatura', width: 50 },
    {
      id: 'estado',
      label: 'Estado',
      width: 50,
      render: (row) =>
        row.estado === 1 ? (
          <CheckCircleIcon color="success" titleAccess="Habilitado" />
        ) : (
          <CancelIcon color="error" titleAccess="Inhabilitado" />
        ),
    },
    {
      id: 'opciones',
      label: 'Opciones',
      width: 90,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomFormCargo idseccion={row.id} />
          <EditUnidadModal unidad={row} onSuccess={obtenerListaUnidad} />
          <CustomDeleteIcon onClick={() => handleOpenDialog(row.id)} />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        <Typography variant='h5' align='center' gutterBottom>
          Lista de Unidad
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Typography variant="body1">Buscar:</Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar en la tabla..."
              value={filtroGeneral}
              onChange={(e) => setFiltroGeneral(e.target.value)}
              sx={{ width: 300 }}
            />
          </Box>
          <AddUnidadModalWrapper
            onSuccess={(nuevaUnidad) => setUnidad((prev) => [...prev, nuevaUnidad])}
          />
        </Box>

        <Paper
          sx={{
            width: '100%',
            padding: 2,
            boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.2)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CustomTable
            columns={columns}
            rows={unidad.filter((unidad) => {
              const texto = filtroGeneral.toLowerCase();
              return (
                (unidad.nombre?.toLowerCase() || "").includes(texto) ||
                (unidad.abreviatura?.toLowerCase() || "").includes(texto) ||
                String(unidad.estado).toLowerCase().includes(texto)
              );
            })}
            onClickRow={(row) => console.log()}
          />
        </Paper>
      </Box>

      {/* Snackbar */}
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

      {/* Dialog de confirmación */}
      <Dialog open={dialog.open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Estás segura/o de eliminar este registro?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              eliminarUnidad(dialog.id, () => eliminarUnidadDeLista(dialog.id));
              handleCloseDialog();
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionarUnidad;
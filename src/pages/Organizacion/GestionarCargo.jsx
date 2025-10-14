import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material';

import { Search as SearchIcon, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import CustomTable from '../../components/organisms/CustomTable';
import CustomDeleteIcon from '../../components/atoms/CustomDeleteIcon';
import EditCargoModal from '../../components/organisms/EditCargoModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const GestionarCargo = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [cargos, setCargos] = useState([]);
  const [ordenNombreAsc, setOrdenNombreAsc] = useState(true);
  const [ordenSeccionAsc, setOrdenSeccionAsc] = useState(true);
  const [ordenarPor, setOrdenarPor] = useState('seccion');

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null, title: '' });

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };
  const closeAlert = () => setAlert({ ...alert, open: false });

  const eliminarCargo = (id, onDeleteSuccess) => {
    setConfirmDialog({
      open: true,
      title: '¿Estás segura/o de eliminar este registro?',
      onConfirm: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/cargos/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          const res = await response.json();

          if (response.ok && res.res) {
            showAlert('Cargo eliminado exitosamente', 'success');
            if (onDeleteSuccess) onDeleteSuccess();
          } else {
            showAlert(res.msg || 'No se pudo eliminar', 'error');
          }
        } catch (error) {
          console.error('Error al eliminar:', error);
          showAlert('Hubo un error inesperado', 'error');
        } finally {
          setConfirmDialog({ open: false, onConfirm: null, title: '' });
        }
      }
    });
  };

  const eliminarCargoDeLista = (id) => {
    setCargos((prev) => prev.filter((cargos) => cargos.id !== id));
  };

  const obtenerListaCargos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos-secciones`);
      if (!response.ok) throw new Error('Error al obtener la lista de cargos');
      const data = await response.json();
      setCargos(data.cargos);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
      showAlert('Error al cargar los cargos', 'error');
    }
  };

  useEffect(() => {
    obtenerListaCargos();
  }, []);

  const rowsOrdenadosYFiltrados = useMemo(() => {
    const texto = filtroNombre.trim().toLowerCase();
    return cargos
      .filter((c) => c.nombre.toLowerCase().includes(texto))
      .sort((a, b) => {
        if (ordenarPor === 'seccion') {
          const comp = a.seccion.localeCompare(b.seccion);
          return ordenSeccionAsc ? comp : -comp;
        } else {
          const comp = a.nombre.localeCompare(b.nombre);
          return ordenNombreAsc ? comp : -comp;
        }
      });
  }, [cargos, filtroNombre, ordenarPor, ordenNombreAsc, ordenSeccionAsc]);

  const columns = [
    {
      id: 'nombre',
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Nombre Cargo
          <IconButton
            size="small"
            onClick={() => {
              setOrdenarPor('nombre');
              setOrdenNombreAsc(!ordenNombreAsc);
            }}
          >
            {ordenarPor === 'nombre' && !ordenNombreAsc ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            )}
          </IconButton>
        </Box>
      ),
      width: 180,
    },
    { id: 'color', label: 'Color', width: 20 },
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
      id: 'seccion',
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Sección
          <IconButton
            size="small"
            onClick={() => {
              setOrdenarPor('seccion');
              setOrdenSeccionAsc(!ordenSeccionAsc);
            }}
          >
            {ordenarPor === 'seccion' && !ordenSeccionAsc ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            )}
          </IconButton>
        </Box>
      ),
      width: 180,
    },
    {
      id: 'opciones',
      label: 'Opciones',
      width: 50,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <EditCargoModal cargo={row} onSuccess={obtenerListaCargos} />
          <CustomDeleteIcon onClick={() => eliminarCargo(row.id, () => eliminarCargoDeLista(row.id))} />
        </Box>
      )
    },
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      {/* Snackbar para alertas */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={closeAlert}>
        <Alert severity={alert.severity} onClose={closeAlert} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Dialog de confirmación */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, onConfirm: null, title: '' })}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, onConfirm: null, title: '' })}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDialog.onConfirm}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Typography variant='h5' align='center' gutterBottom>
          Lista de Cargos
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
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
            rows={rowsOrdenadosYFiltrados}
            onClickRow={(row) => console.log()}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default GestionarCargo;
import React, { useEffect, useState, useMemo } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import CredencialesTable from '../../components/organisms/CredencialesTable';

const ListaCredenciales = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCI, setFiltroCI] = useState('');
  const [personal, setPersonal] = useState([]);
  const [ordenAsc, setOrdenAsc] = useState(true);

  useEffect(() => {
    obtenerPersonal();
  }, []);

  const obtenerPersonal = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personal`);
      const data = await response.json();
      setPersonal(data.personal.map(p => ({ ...p, foto: null })));
    } catch (error) {
      console.error('Error al obtener personal:', error);
    }
  };

  const personalVisible = useMemo(() => {
  let lista = personal.filter((item) => {
    const nombreCompleto = `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`.toLowerCase();
    const ciTexto = item.ci?.toLowerCase() || '';
    return (
      nombreCompleto.includes(filtroNombre.toLowerCase()) &&
      ciTexto.includes(filtroCI.toLowerCase())
    );
  });
  return lista;
  }, [personal, filtroNombre, filtroCI]);

  const abrirVentanaEdicion = (idPersonal) => {
    const nuevaVentana = window.open(
      `/editar-personal/${idPersonal}`,
      '_blank',
      'width=800,height=600'
    );

    const timer = setInterval(() => {
      if (nuevaVentana.closed) {
        clearInterval(timer);
        obtenerPersonal();
      }
    }, 500);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 1010 }}>
        <Typography variant="h5" align="center">Lista de Personal</Typography>

        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
          <TextField
            label="Buscar por nombre completo..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            size="small"
            sx={{ width: 250 }}
          />
          <TextField
            label="Buscar por CI..."
            value={filtroCI}
            onChange={(e) => setFiltroCI(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
        </Box>

        <CredencialesTable
          data={personalVisible}
          onDeleteSuccess={obtenerPersonal}
          onEditClick={abrirVentanaEdicion}
        />
      </Box>
    </Box>
  );
};

export default ListaCredenciales;
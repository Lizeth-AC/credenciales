import React, { useEffect, useState, useMemo } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import CredencialesTable from '../../components/organisms/CredencialesTable';
import { Autocomplete } from '@mui/material';


const ListaCredenciales = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCI, setFiltroCI] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [ordenAsc, setOrdenAsc] = useState(true);

  const listaCI = useMemo(() => {
  return [...new Set(personal.map(p => p.ci))];
}, [personal]);

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
  return personal
    .filter((item) => {
      const nombreCompleto =
        `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`.toLowerCase();

      const matchNombre = nombreCompleto.includes(filtroNombre.toLowerCase());

      const matchCI =
        filtroCI.length === 0 || filtroCI.includes(item.ci);

      return matchNombre && matchCI;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 👈 DESC
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
          <Autocomplete
            multiple
            options={listaCI}
            value={filtroCI}
            onChange={(event, newValue) => {
              setFiltroCI(newValue);
            }}
            size="small"
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filtrar por CI"
                placeholder="Selecciona uno o varios"
              />
            )}
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
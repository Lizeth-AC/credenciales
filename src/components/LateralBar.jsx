import { Drawer, ListItemButton, ListItemText, List, IconButton } from "@mui/material";
import { useState } from "react";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LateralMenuItem from "./LateralMenuItem";
import { useNavigate } from "react-router-dom";


const LateralBar = ({anchoCaja, open, setOpen}) => {
  const navigate = useNavigate();

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          top:'15%',
          left: open ? anchoCaja - 40 : 8,
          zIndex: 1300,
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
          borderRadius: 2,
          color: 'primary.main',
          transition: 'left 0.3s',
        }}
      >
        {open ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
      </IconButton>
      <Drawer
        variant='permanent'
        open={open}
        sx={{
          position: 'relative',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: open ? anchoCaja : 0,
            marginTop: 12.5,
            background: 'linear-gradient(135deg, #f6f6f6ff 70%, #e3e6ee 100%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18), 0 1.5px 4px rgba(0,0,0,0.12)',
            borderRadius: 1.4,
            border: '1px solid #e0e0e0',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <List sx={{ color: '#4d4d4dff', top: 40, minWidth: open ? anchoCaja : 0 }}>
          <ListItemButton
            onClick={() => navigate('/Inicio')}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: 'bold',
                fontSize: 15,
                textShadow: '0 1px 2px rgba(0,0,0,0.08)',
              },
              '&:hover .MuiListItemText-primary': {
                color: 'primary.main',
                textShadow: '0 2px 6px rgba(0,0,0,0.15)',
              },
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              m: 1,
            }}
          >
            <ListItemText primary="Inicio" />
          </ListItemButton>

          <LateralMenuItem
            titulo="Usuarios"
            subItems={[
              { label: 'Lista de Credenciales', path: 'Lista_Credenciales' },
              { label: 'Crear Credencial Individual', path: 'Credencial_Individual' },
              { label: 'Lista de Externo', path: 'Lista_Externo' },
            ]}
          />

          <LateralMenuItem
            titulo="Organización"
            subItems={[
              { label: 'Gestionar Unidad', path: 'Gestionar_Unidad' },
              { label: 'Gestionar Cargo', path: 'Gestionar_Cargo' },
              { label: 'Gestionar Externo', path: 'Gestionar_Externo' },
            ]}
          />
        </List>
      </Drawer>
    </>
  );
}

export default LateralBar;
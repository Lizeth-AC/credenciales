import { AppBar, Toolbar, Typography, Box, Stack, Button} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const NavBar = (anchoCaja) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    sessionStorage.clear();
    document.cookie = 'token=; Max-Age=0';
    navigate('/Login');
  };
  return (
    <AppBar position="fixed"
  sx={{
    width: '100vw', 
    left: 0,        
    right: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    
  }}>
      <Toolbar disableGutters sx={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
        <Box sx={{ height: '8px', backgroundColor: '#FBCC00', width: '100%' }} />
        <Box sx={{ backgroundColor: '#ffffff'}}>
          <Stack direction="row" spacing={40} justifyContent="center" alignItems="center" p={0.2}>
            <img src="/OEPLogo.jpg" alt="img1" height={55}/>
            <img src="/TEDLogo.jpg" alt="img2" height={55} />
            <img src="/EleccionesLogo.png" alt="img3" height={55} />
          </Stack>
        </Box>
        <Box
          sx={{
            position: 'relative',
            textAlign: 'center',
            width: '100%',
            backgroundColor: 'primary.main',
          }}
        >
          <Button
            sx={{
              color: '#FFFFFF',
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 'auto',
              backgroundColor: 'transparent',
              '&:hover': {
                color: 'rgba(0, 0, 0, 0.2)',
              },
              '&:active': {
                color: 'rgba(0, 0, 0, 0.3)',
              },
            }}
            onClick={handleLogout}
          >
            <NotificationsIcon />
          </Button>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontSize: '21px',
              color: '#FFFFFF',
            }}
          >
            SISTEMA DE CREDENCIALES
          </Typography>

          <Button
            sx={{
              color: '#FFFFFF',
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              minWidth: 'auto',
              backgroundColor: 'transparent',
              '&:hover': {
                color: 'rgba(0, 0, 0, 0.2)',
              },
              '&:active': {
                color: 'rgba(0, 0, 0, 0.3)',
              },
            }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

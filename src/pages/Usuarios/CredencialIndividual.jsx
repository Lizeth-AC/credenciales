import { Typography, Grid, Box, Paper, Container } from '@mui/material';
import CustomFormRegister from '../../components/organisms/CustomFormRegister';

const CredencialIndividual = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '80vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Box sx={{ width: '100%', maxWidth: 1250 }}>
          <Typography variant="h5" align="center">Registrar Datos</Typography>
          <Paper style={{height: '75vh'}}>
            <iframe
              src="https://walisanga.space/credenciales-2025/"
              title="Vista Registro"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </Paper>
      </Box>
    </Box>

  );
};

export default CredencialIndividual;

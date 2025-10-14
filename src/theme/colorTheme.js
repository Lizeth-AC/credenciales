import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const colorTheme = createTheme({
  palette: {
    primary: {
      main: '#7C7C7C',
    },
    secondary: {
      main: '#CCB347',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: 'rgba(241,240,240,0.89)',
      paper: '#F7F7F7',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
  MuiButton: {
    styleOverrides: {
      root: {
        '&:focus, &:focus-visible': {
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:focus, &:focus-visible': {
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      },
    },
  },
}

});

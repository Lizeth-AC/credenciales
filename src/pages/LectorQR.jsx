import { useRef, useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, Dialog, DialogTitle } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const LectorQR = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const qrCodeRegionId = 'qr-scanner-region';
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  // 👉 Inicia el escáner de cámara
  const startScanner = async () => {
    setError('');
    const scannerRegion = document.getElementById(qrCodeRegionId);
    if (scannerRegion) scannerRegion.innerHTML = '';

    try {
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          handleScanSuccess(decodedText);
        },
        (scanError) => {
          console.warn('Scan error:', scanError);
        }
      );

      setScanning(true);
    } catch (err) {
      setError('No se pudo iniciar la cámara: ' + (err?.message || JSON.stringify(err)));
    }
  };

  // 👉 Detiene el escáner de cámara
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.warn('Error al detener:', err);
      }

      try {
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error al limpiar:', err);
      }

      html5QrCodeRef.current = null;
    }

    const scannerRegion = document.getElementById(qrCodeRegionId);
    if (scannerRegion) scannerRegion.innerHTML = '';
    setScanning(false);
  };

  const handleClear = async () => {
    setError('');
    await stopScanner();
  };

  const handleInfo = () => setOpenInfo(true);

  // ✅ Actualizado: limpia caracteres raros y redirige según tipo
  const handleScanSuccess = (decodedText) => {
    const cleaned = decodedText.replace(/['"]/g, '-').trim(); // limpia comillas o espacios
    console.log('Código detectado:', cleaned);

    const encodedToken = encodeURIComponent(cleaned);
    if (cleaned.startsWith('externo-')) {
      navigate(`/accesoObservador/${encodedToken}`);
    } else {
      navigate(`/accesoComputo/${encodedToken}`);
    }
  };

  // ✅ Nuevo: Soporte para lector de barras (pistola)
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const now = Date.now();

      // Si pasan más de 50ms entre teclas, se reinicia el buffer
      if (now - lastKeyTime > 50) barcodeBuffer = '';
      lastKeyTime = now;

      if (e.key.length === 1) {
        barcodeBuffer += e.key;
      } else if (e.key === 'Enter') {
        const code = barcodeBuffer.trim();
        barcodeBuffer = '';

        if (code && !scanning) {
          console.log('Lector de barras detectó:', code);
          stopScanner(); // detiene el QR si está activo
          handleScanSuccess(code);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scanning]); // se reactiva si cambia el estado del escáner

  return (
    <Paper
      sx={{
        p: 3,
        maxWidth: 500,
        margin: 'auto',
        borderRadius: 3,
        height: 600,
        position: 'relative',
      }}
    >
      <Box>
        <Grid container spacing={0.5} flexDirection="row" justifyContent={'center'} mb={1}>
          <img src={`/TEDLogo.png`} alt="Logo TED" style={{ width: '35px', height: '100%' }} />
          <Box backgroundColor="primary.main" width="1px" />
          <img src={`/EleccionesLogo.png`} alt="Logo Elecciones" style={{ width: '70px', height: '100%' }} />
        </Grid>

        <Typography align="center" color="primary.main" fontSize={12} lineHeight={1.2}>
          {'ELECCIONES GENERALES 2025'}
          <br />
          {'SISTEMA DE ACCESO CÓMPUTO'}
          <br />
          <br />
        </Typography>

        <Box
          id={qrCodeRegionId}
          sx={{
            width: '100%',
            height: '400px',
            borderRadius: 2,
            border: '2px dashed #ccc',
            backgroundImage: `url('/EleccionesLogo.png')`,
            backgroundSize: '80% auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            position: 'relative',
            overflow: 'hidden',
            opacity: 0.5,
          }}
        />
      </Box>

      <Box mt={2} display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
        {!scanning && (
          <Button
            onClick={async () => {
              await stopScanner();
              await startScanner();
            }}
            variant="contained"
            sx={{ color: 'white', backgroundColor: '#07854E' }}
          >
            ESCANEAR
          </Button>
        )}
        {scanning && (
          <Button
            onClick={stopScanner}
            variant="contained"
            sx={{ color: '#FFFFFF', backgroundColor: 'primary.main' }}
          >
            DETENER
          </Button>
        )}
        <Button onClick={handleInfo} variant="contained" sx={{ color: 'white', backgroundColor: 'secondary.main' }}>
          Acerca de
        </Button>
        <Button onClick={handleClear} variant="contained" sx={{ color: 'white', backgroundColor: 'red' }}>
          Limpiar
        </Button>
      </Box>

      {error && (
        <Typography mt={2} color="error">
          ⚠️ {error}
        </Typography>
      )}

      <Dialog open={openInfo} onClose={() => setOpenInfo(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Información</DialogTitle>
        <Box p={2}>
          <Typography fontSize={14}>
            Desarrollado por Tecnologías del Tribunal Electoral Departamental de Cochabamba.
            <br />
            <br />
          </Typography>
          <Typography fontSize={14}>
            Este sistema permite escanear códigos QR o leer códigos de barras para registrar el acceso a las salas de
            cómputo.
            <br />
            Asegúrese de enfocar correctamente el código o que el lector esté bien configurado.
          </Typography>
          <Box mt={2} textAlign="right">
            <Button onClick={() => setOpenInfo(false)} variant="contained">
              Cerrar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default LectorQR;
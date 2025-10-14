import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  Slider
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '../atoms/CustomTextField';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';

// Helper para recortar y comprimir
async function getCroppedImg(imageSrc, cropPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropPixels.width;
      canvas.height = cropPixels.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height
      );

      canvas.toBlob(async (blob) => {
        const compressedBlob = await imageCompression(blob, { maxSizeMB: 0.3 });
        resolve(new File([compressedBlob], 'foto.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.8);
    };
    image.onerror = (err) => reject(err);
  });
}

function FormularioObservador({ onSubmit, loading, tipo, onCancel, celular }) {
  const [preview, setPreview] = useState(null);
  const [ciOptions, setCiOptions] = useState([]);
  const [loadingCis, setLoadingCis] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [openCropper, setOpenCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const initialValues = {
    nombre_completo: '',
    ci: '',
    identificador: '',
    organizacion_politica: '',
    foto: null,
  };

  const validationSchema = Yup.object({
    nombre_completo: Yup.string().required('Campo obligatorio'),
    identificador: Yup.string().nullable(),
    organizacion_politica: Yup.string().nullable(),
  });

  useEffect(() => {
    const fetchCis = async () => {
      try {
        setLoadingCis(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/list/observador-cis/`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setCiOptions(data.cis || []);
      } catch (error) {
        console.error('Error al obtener los CIs:', error);
        setCiOptions([]);
      } finally {
        setLoadingCis(false);
      }
    };
    fetchCis();
  }, []);

  const handleSelectCi = async (value, setFieldValue) => {
    if (!value) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/observador/${value}`);
      if (!res.ok) throw new Error('No se pudo obtener el observador');
      const data = await res.json();
      setFieldValue('nombre_completo', data.data.nombre_completo || '');
      setFieldValue('ci', data.data.ci || '');
      setFieldValue('identificador', data.data.identificador || '');
      setFieldValue('organizacion_politica', data.data.organizacion_politica || '');
      if (data.data.foto) {
        setPreview(`data:image/jpeg;base64,${data.data.foto}`);
      }
    } catch (error) {
      console.error('Error al obtener observador:', error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
      {({ setFieldValue, values }) => (
        <Form>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6" align="center">Registro de Observador</Typography>

            <Autocomplete
              freeSolo
              options={ciOptions}
              loading={loadingCis}
              value={values.ci || ''}
              onChange={(e, newValue) => {
                setFieldValue('ci', newValue || '');
                handleSelectCi(newValue, setFieldValue);
              }}
              onInputChange={(e, newInputValue) => setFieldValue('ci', newInputValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="CI"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCis ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <CustomTextField name="nombre_completo" label="Nombre completo" required onlyLetters />
            {(tipo === 'delegado' || tipo === 'candidato' || tipo === 'observador') && (
              <CustomTextField name="organizacion_politica" label="Organización Política" required />
            )}
            {tipo === 'prensa' && <CustomTextField name="identificador" label="Identificador" required />}

            {/* Botón subir foto */}
            <Button variant="outlined" component="label">
              Subir Foto
              <input
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageSrc(reader.result);
                    setOpenCropper(true);
                    setZoom(1);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </Button>

            {/* Cropper Modal */}
            <Dialog open={openCropper} onClose={() => setOpenCropper(false)} maxWidth="sm" fullWidth>
              <DialogContent sx={{ position: 'relative', height: 400, background: '#333' }}>
                {imageSrc && (
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                    />
                    <Box sx={{ position: 'absolute', bottom: 10, left: 20, right: 20 }}>
                      <Typography variant="body2" color="white">Zoom</Typography>
                      <Slider value={zoom} min={1} max={3} step={0.01} onChange={(e, z) => setZoom(z)} sx={{ color: 'white' }} />
                    </Box>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenCropper(false)}>Cancelar</Button>
                <Button
                  onClick={async () => {
                    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
                    setFieldValue('foto', croppedFile);
                    setPreview(URL.createObjectURL(croppedFile));
                    setOpenCropper(false);
                  }}
                >
                  Recortar
                </Button>
              </DialogActions>
            </Dialog>

            {preview && (
              <Box mt={1} display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={1}>
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrar'}
              </Button>
              {celular ? null :
                <Button 
                  onClick={onCancel}
                  variant="outlined"
                  size="small"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                >Cancelar</Button>
              }
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default FormularioObservador;
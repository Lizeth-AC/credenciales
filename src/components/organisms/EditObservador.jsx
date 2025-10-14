// src/components/EditarObservador.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Slider
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../atoms/CustomTextField";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";

// Helper para recortar y comprimir la imagen
async function getCroppedImg(imageSrc, cropPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropPixels.width;
      canvas.height = cropPixels.height;
      const ctx = canvas.getContext("2d");

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
        resolve(new File([compressedBlob], "foto.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.8);
    };
    image.onerror = (err) => reject(err);
  });
}

function EditObservador({ ci, tipo, token, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    id: "",
    nombre_completo: "",
    ci: "",
    identificador: "",
    organizacion_politica: "",
    foto: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [openCropper, setOpenCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const validationSchema = Yup.object({
    nombre_completo: Yup.string().required("Campo obligatorio"),
    ci: Yup.string().required("Campo obligatorio"),
    identificador: Yup.string().nullable(),
    organizacion_politica: Yup.string().nullable(),
    foto: Yup.mixed().nullable(),
  });

  // Cargar datos existentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/observador/${ci}`);
        const data = await res.json();
        const observador = data.data;

        setFormData({
          id: observador.id || "",
          nombre_completo: observador.nombre_completo || "",
          ci: observador.ci || "",
          identificador: observador.identificador || "",
          organizacion_politica: observador.organizacion_politica || "",
          foto: null,
        });

        if (observador.foto) {
          const base64String =
            typeof observador.foto === "string"
              ? observador.foto.startsWith("data:")
                ? observador.foto
                : `data:image/jpeg;base64,${observador.foto}`
              : null;
          setPreview(base64String);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setFetching(false);
      }
    };

    if (ci) fetchData();
  }, [ci]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("id", formData.id);
      body.append("nombre_completo", values.nombre_completo);
      body.append("ci", values.ci);
      body.append("identificador", values.identificador);
      body.append("organizacion_politica", values.organizacion_politica);
      if (values.foto) body.append("foto", values.foto);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/actualizar-observador/${token}`, {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (data.res === true) {
        onUpdate?.();
        onClose?.();
      } else {
        alert(data.msg || "Error al actualizar");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar observador");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <CircularProgress />;

  return (
    <Formik enableReinitialize initialValues={formData} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ setFieldValue, isSubmitting }) => (
        <Form>
          <Typography variant="h6" align="center" gutterBottom>
            Editar Observador
          </Typography>

          <CustomTextField name="nombre_completo" label="Nombre completo" />
          <CustomTextField name="ci" label="CI" />

          {tipo === "delegado" || tipo === "candidato" || tipo === "observador" ? (
            <CustomTextField name="organizacion_politica" label="Organización Política" />
          ) : tipo === "prensa" ? (
            <CustomTextField name="identificador" label="Identificador" />
          ) : null}

          <Box mt={1}>
            <Button variant="outlined" component="label" sx={{ mr: 1 }} size="small">
              {preview ? "Cambiar foto" : "Subir foto"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImageSrc(reader.result);
                      setOpenCropper(true);
                      setZoom(1);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
            {preview ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setImageSrc(preview);
                setOpenCropper(true);
                setZoom(1);
              }}
            >
              Editar imagen
            </Button>) : null}
          </Box>
          {preview && (
            <Box mt={2} textAlign="center">
              <img
                src={preview}
                alt="preview"
                style={{ width: 120, height: 120, borderRadius: 8, objectFit: "cover" }}
              />
              
            </Box>
          )}

          <Dialog open={openCropper} onClose={() => setOpenCropper(false)} maxWidth="sm" fullWidth>
            <DialogContent sx={{ position: "relative", height: 400, background: "#222", borderRadius: 2 }}>
              {imageSrc && (
                <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                  />
                  <Box sx={{ position: "absolute", bottom: 10, left: 20, right: 20 }}>
                    <Typography variant="body2" color="white">Zoom</Typography>
                    <Slider
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.01}
                      onChange={(e, z) => setZoom(z)}
                      sx={{ color: "white" }}
                    />
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCropper(false)}>Cancelar</Button>
              <Button
                onClick={async () => {
                  const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
                  setFieldValue("foto", croppedFile);
                  setPreview(URL.createObjectURL(croppedFile));
                  setOpenCropper(false);
                }}
              >
                Recortar
              </Button>
            </DialogActions>
          </Dialog>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
            <Button 
              onClick={onClose}
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
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default EditObservador;
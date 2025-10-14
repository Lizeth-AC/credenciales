import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Box,
  Modal,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { Formik, Form, useFormikContext } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import registerValidation from "../../validations/RegisterValidation";
import CustomAutocomplete from "../atoms/CustomAutoComplete";
import SeccionCargoFields from "../molecules/SeccionCargoFields";
import PersonalInfoFields from "../molecules/PersonalInfoFields";
import SeccionUploadImage from "../molecules/SeccionUploadImage";

const MostrarCargoNombre = ({ cargoId, cargoOptions = [] }) => {
  const cargo = cargoOptions.find((c) => String(c.value) === String(cargoId));

  return <>{cargo?.label || "Ninguno"}</>;
};



const CustomFormRegister = () => {
  const [recintoSeleccionado, setRecintoSeleccionado] = useState(null);
  const [cargoOptions, setCargoOptions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [seccionOptions, setSeccionOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [submitFunction, setSubmitFunction] = useState(null);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/list/secciones`
        );
        if (!resp.ok) throw new Error("Error al obtener secciones");
        const data = await resp.json();
        setSeccionOptions(
          data.map((item) => ({ value: item.id, label: item.nombre }))
        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchSecciones();
  }, []);

  const initialValues = {
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    numeroCarnet: "",
    complemento: "",
    numeroCelular: "",
    secciones: "3",
    cargos: "",
    recinto:"",
    codVerificacion: "",
    imagen: null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("nombre", values.nombres);
      formData.append("paterno", values.apellidoPaterno);
      formData.append("materno", values.apellidoMaterno);
      formData.append("ci", values.numeroCarnet);
      formData.append("extencion", "CB");
      formData.append("complemento", values.complemento);
      formData.append("celular", values.numeroCelular);
      formData.append("id_cargo", values.cargos);
      formData.append("token", values.codVerificacion);
      formData.append("id_recinto", values.cargos === 3 ? recintoSeleccionado?.value || "" : "");
      formData.append("estado", 0);
      formData.append("accesoComputo", 0);
      if (values.imagen) formData.append("photo", values.imagen);

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/personal`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await resp.json();
      if (resp.ok) {
        showSnackbar("¡Registro exitoso!", "success");
        resetForm();
      } else {
        showSnackbar("Error al guardar", "error");
      }
    } catch (e) {
      console.error(e);
      showSnackbar("Error de conexión con la API", "error");
    }
  };

  const openModalBeforeSubmit = (values, formikHelpers) => {
    setPreviewData(values);
    setSubmitFunction(() => () => handleSubmit(values, formikHelpers));
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    if (submitFunction) submitFunction();
  };

  const handleCancel = () => {
    setModalOpen(false);
    setPreviewData(null);
    setSubmitFunction(null);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={registerValidation}
        onSubmit={openModalBeforeSubmit}
        validateOnMount
      >
        {({ isValid, dirty, values }) => (
          <Form>
            <Grid
              width="100%"
              container
              spacing={1}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >

              <Grid container spacing={0.5} direction="column" sx={{ width: { xs: "100%", md: "55%" } }}>
                <SeccionCargoFields
                  seccionOptions={seccionOptions}
                  cargoOptions={cargoOptions}
                  setCargoOptions={setCargoOptions}
                />
                <PersonalInfoFields />
                {values.cargos === 3 && (
                  <Box item="true" xs={12}>
                    <Typography variant="subtitle2">
                      Seleccione el recinto asignado
                    </Typography>
                    <CustomAutocomplete onChange={(item) => setRecintoSeleccionado(item)}/>
                  </Box>
                )}
              </Grid>

              <Box
                sx={{
                  backgroundColor: "primary.main",
                  width: "0.5px",
                  display: { xs: "none", md: "block" },
                }}
              />


              <Grid container spacing={0.5} direction="column" sx={{ width: { xs: "100%", md: "40%" } }}>
                <SeccionUploadImage />

                <Grid item xs={12} marginTop="10%" ml="40%">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!(dirty && isValid)}
                  >
                    Enviar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Modal open={modalOpen} onClose={handleCancel}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={handleCancel}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Confirmar Información
          </Typography>
          {previewData && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {previewData.imagen && (
                <img
                  src={URL.createObjectURL(previewData.imagen)}
                  alt="Foto"
                  width={100}
                  style={{ alignSelf: "center", borderRadius: 8 }}
                />
              )}
              <Typography>
                <strong>Nombre:</strong> {previewData.nombres}{" "}
                {previewData.apellidoPaterno} {previewData.apellidoMaterno}
              </Typography>
              <Typography>
                <strong>CI:</strong> {previewData.numeroCarnet}
              </Typography>
              <Typography>
                <strong>Celular:</strong> {previewData.numeroCelular}
              </Typography>
              <Typography>
                <strong>Cargo:</strong>{" "}
                <MostrarCargoNombre
                  cargoId={previewData.cargos}
                  cargoOptions={cargoOptions}
                />
              </Typography>

            </Box>
          )}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Guardar
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  );
};

export default CustomFormRegister;
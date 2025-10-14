import React, { useState } from "react";
import CustomModal from "../molecules/CustomModal";
import { IconButton, Snackbar, Alert } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const CustomFormCargo = ({ idseccion }) => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const fields = [
    { name: "nombre", label: "Nombre", required: true, onlyLetters: true },
    {
      name: "estado",
      label: "Estado",
      required: true,
      options: [
        { value: "habilitado", label: "Habilitado" },
        { value: "deshabilitado", label: "Inhabilitado" },
      ],
    },
    {
      name: "color",
      label: "Color",
      required: true,
      options: [
        { value: "verde", label: "Verde" },
        { value: "plomo", label: "Plomo" },
        { value: "blanco", label: "Blanco" },
        { value: "naranja", label: "Naranja" },
        { value: "guindo", label: "Guindo" },
        { value: "cafe", label: "Café" },
        { value: "externo", label: "Externo" },
      ],
    },
  ];

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleSubmit = async (values) => {
    try {
      const data = new FormData();
      data.append("nombre", values.nombre);
      data.append("estado", values.estado === "habilitado" ? 1 : 0);
      data.append("color", values.color);
      data.append("idseccion", idseccion);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cargos`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        showAlert("¡Registro exitoso!", "success");
        setOpen(false);
      } else {
        showAlert(result?.msg || "Error al guardar", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error de conexión con la API", "error");
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <IconButton onClick={() => setOpen(true)}>
        <GroupAddIcon />
      </IconButton>

      <CustomModal
        title="Registrar nuevo cargo"
        fields={fields}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CustomFormCargo;
import React, { useState } from "react";
import CustomAddIcon from "../../components/atoms/CustomAddIcon";
import CustomModal from "../../components/molecules/CustomModal";
import { Snackbar, Alert } from "@mui/material";

const AddUnidadModalWrapper = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const fields = [
    { name: "nombre", label: "Nombre", required: true, onlyLetters: true },
    { name: "abreviatura", label: "Abreviatura", required: true },
    {
      name: "estado",
      label: "Estado",
      required: true,
      options: [
        { value: 1, label: "Habilitado" },
        { value: 0, label: "Inhabilitado" },
      ],
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/secciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errores de validación backend:", errorData);

        if (errorData.errors) {
          const mensajes = Object.values(errorData.errors).flat().join("\n");
          showAlert("Errores: " + mensajes, "error");
        } else {
          showAlert("Error: " + errorData.message, "error");
        }
        return;
      }

      const data = await response.json();

      if (typeof onSuccess === "function") {
        onSuccess(data.seccion);
      }
      showAlert("Unidad guardada exitosamente", "success");
      setOpen(false);

    } catch (error) {
      console.error("Error guardando unidad:", error);
      showAlert("Error guardando unidad, revisa la consola", "error");
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

      <CustomAddIcon onClick={handleOpen} />
      <CustomModal
        title="Añadir Unidad"
        fields={fields}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddUnidadModalWrapper;
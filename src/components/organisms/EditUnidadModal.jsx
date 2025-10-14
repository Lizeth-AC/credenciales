import React, { useState } from "react";
import CustomEditIcon from "../../components/atoms/CustomEditIcon";
import CustomModal from "../../components/molecules/CustomModal";
import { Snackbar, Alert } from "@mui/material";

const EditUnidadModal = ({ unidad, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

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

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/secciones/${unidad.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const mensajes = Object.values(data.errors).flat().join("\n");
          showAlert("Errores:\n" + mensajes, "error");
        } else {
          showAlert("Error: " + data.message, "error");
        }
        return;
      }

      if (typeof onSuccess === "function") {
        onSuccess(data.seccion);
      }

      showAlert("Cargo actualizada exitosamente", "success");
      handleClose();
    } catch (error) {
      console.error("Error actualizando unidad:", error);
      showAlert("Error actualizando unidad", "error");
    }
  };

  return (
    <>
      {/* Snackbar global */}
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

      <CustomEditIcon onClick={handleOpen} />
      <CustomModal
        title="Editar Cargo"
        fields={fields}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={unidad}
      />
    </>
  );
};

export default EditUnidadModal;
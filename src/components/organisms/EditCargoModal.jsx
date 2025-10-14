import React, { useState, useEffect } from "react";
import CustomEditIcon from "../../components/atoms/CustomEditIcon";
import CustomModal from "../../components/molecules/CustomModal";
import { Snackbar, Alert } from "@mui/material";

const EditCargoModal = ({ cargo, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [secciones, setSecciones] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    if (open) obtenerSecciones();
  }, [open]);

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const obtenerSecciones = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/secciones`);
      if (!response.ok) throw new Error("Error al obtener secciones");
      const data = await response.json();
      setSecciones(data || []);
    } catch (error) {
      console.error("Error cargando secciones:", error);
      showAlert("No se pudieron cargar las secciones", "error");
    }
  };

  const fields = [
    { name: "nombre", label: "Nombre", required: true, onlyLetters: true },
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
    {
      name: "estado",
      label: "Estado",
      required: true,
      options: [
        { value: 1, label: "Habilitado" },
        { value: 0, label: "Inhabilitado" },
      ],
    },
    {
      name: "idseccion",
      label: "Sección",
      required: true,
      options: [
        { value: "", label: "Seleccione una sección" },
        ...secciones.map((s) => ({
          value: String(s.id),
          label: s.nombre,
        })),
      ],
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cargos/${cargo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            idseccion: Number(values.idseccion), // convertir a número
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Errores backend:", data);
        showAlert(data.message || "Error en la actualización", "error");
        return;
      }

      if (typeof onSuccess === "function") onSuccess(data.seccion);

      showAlert("Cargo actualizado exitosamente", "success");
      handleClose();
    } catch (error) {
      console.error("Error actualizando cargo:", error);
      showAlert("Error actualizando cargo", "error");
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

      <CustomEditIcon onClick={handleOpen} />
      <CustomModal
        title="Editar Cargo"
        fields={fields}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={{
          ...cargo,
          idseccion: cargo.idseccion ? String(cargo.idseccion) : "",
        }}
      />
    </>
  );
};

export default EditCargoModal;
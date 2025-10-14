import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useFormikContext } from "formik";

import CustomSelect from "../atoms/CustomSelect";

const SeccionCargoFields = ({ seccionOptions, cargoOptions, setCargoOptions }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
  const fetchCargos = async () => {
    if (!values.secciones) {
      setCargoOptions([]);
      setFieldValue("cargos", "");
      return;
    }
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/secciones/secciones-cargos/${values.secciones}`
      );
      if (!resp.ok) throw new Error("Error al obtener cargos");

      const data = await resp.json();
      const opciones = (data.data?.cargos ?? []).map((cargo) => ({
        value: cargo.id_cargo,
        label: cargo.nombre_cargo,
      }));
      setCargoOptions(opciones);

      if (!values.cargos) {
        const cargoDefault = opciones.find((op) => op.value === 3);
        if (cargoDefault) {
          setFieldValue("cargos", 3);
        } else {
          setFieldValue("cargos", "");
        }
      } else {
        if (!opciones.find((op) => op.value === values.cargos)) {
          setFieldValue("cargos", "");
        }
      }
    } catch (e) {
      console.error(e);
      setCargoOptions([]);
      setFieldValue("cargos", "");
    }
  };
  fetchCargos();
}, [values.secciones]);


  return (
    <Grid container item justifyContent="space-between">
      <Grid item xs={12} md={6} sx={{width:"48%"}}>
        <CustomSelect
          label="Secciones"
          name="secciones"
          options={seccionOptions}
          required
        />
      </Grid>
      <Grid item xs={12} md={6} sx={{width:"48%"}}>
        <CustomSelect
          label="Cargo"
          name="cargos"
          options={cargoOptions}
          disabled={!values.secciones}
          required
        />
      </Grid>
    </Grid>
  );
};

export default SeccionCargoFields;

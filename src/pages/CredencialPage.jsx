import React, { useState, useContext } from "react";
import { LateralBarContext } from "../Layout/Layout";
import CredentialPrintPage from "../components/organisms/CredentialPrintPage";
import {Typography } from "@mui/material";

const CredencialesPage = () => {
  const [data, setData] = useState([]);
  

  const fetchData = async (inicio, fin, cargo, circunscripcion, accesoComputo) => {
    try {
      const params = new URLSearchParams();

      if (inicio) params.append("inicio", inicio);
      if (fin) params.append("fin", fin);
      if (cargo) params.append("cargo", cargo);
      if (circunscripcion) params.append("circunscripcion", circunscripcion);
      if (accesoComputo === 1) params.append("accesoComputo", 1);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personal-filter?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      setData(result.personal);
      return result;
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  const { lateralOpen } = useContext(LateralBarContext);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: lateralOpen ? 'flex-end' : 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingRight: lateralOpen ? 20 : 0,
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200 }}>
        <Typography variant="h5" align="center">Impresión de Credencial</Typography>
        <CredentialPrintPage data={data} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default CredencialesPage;

  



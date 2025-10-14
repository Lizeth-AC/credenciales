import React, { useEffect, useState, useRef } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import CredentialPageGroup from "../components/organisms/CredentialPageGroup";

export default function PreviewCredenciales() {
  const [pages, setPages] = useState([]);
  const [side, setSide] = useState("anverso");
  const [cargos, setCargos] = useState([]);
  const [accesoComputo, setAccesoComputo] = useState(0);
  const [ids, setIds] = useState([]);
  const apiCalled = useRef(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); 

  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    const storedPages = localStorage.getItem("credenciales_preview_pages");
    const storedSide = localStorage.getItem("credenciales_preview_side");
    const storedAcceso = localStorage.getItem("credenciales_preview_acceso");
    const storedIds = localStorage.getItem("credenciales_preview_ids");

    if (storedPages) setPages(JSON.parse(storedPages));
    if (storedSide) setSide(storedSide);
    if (storedAcceso !== null) setAccesoComputo(parseInt(storedAcceso));
    if (storedIds) setIds(JSON.parse(storedIds));
  }, []);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
        if (!resp.ok) throw new Error("Error al obtener cargos");
        const data = await resp.json();
        setCargos(data);
      } catch (error) {
        console.error(error);
        showAlert("❌ Error al obtener cargos", "error");
      }
    };
    fetchCargos();
  }, []);

  const callUpdateEstadoAPI = async (useAlert = true, useBeacon = false) => {
    if (apiCalled.current || !ids.length) return;
    apiCalled.current = true;

    const estado = 1;
    const baseUrl = `${import.meta.env.VITE_API_URL}/updateEstado`;
    const queryParams = new URLSearchParams();

    ids.forEach(id => queryParams.append("ids[]", id));
    queryParams.append("estado", estado);

    const fullUrl = `${baseUrl}?${queryParams.toString()}`;
    console.log("Llamando API PATCH a:", fullUrl);

    if (useBeacon && navigator.sendBeacon) {
      console.warn("sendBeacon no soportado para PATCH");
      return;
    }

    try {
      const resp = await fetch(fullUrl, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ force: true })
      });

      const text = await resp.text();
      console.log("Respuesta cruda:", text);

      if (!resp.ok) throw new Error(`Estado HTTP ${resp.status}`);

      if (useAlert) showAlert("✅ Estado actualizado correctamente", "success");
    } catch (error) {
      console.error("❌ Error en actualización:", error);
      if (useAlert) showAlert("⚠️ Ocurrió un error al actualizar estado", "error");
    }
  };

  useEffect(() => {
    if (!ids.length) return;

    const handleAfterPrint = () => {
      callUpdateEstadoAPI(true, false);
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, [ids]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      callUpdateEstadoAPI(false, true);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [ids]);

  const handlePrint = () => {
    window.print();
  };

  if (!pages.length) {
    return <h2 style={{ textAlign: "center", marginTop: 10 }}>No hay credenciales para mostrar.</h2>;
  }
console.log("p:",pages)
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print-area, .print-area * { visibility: visible !important; }
          .print-area {
            position: absolute;
            left: 0; top: 0;
            width: 100vw;
            background: white !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 800, display: "flex", justifyContent: "flex-end", marginTop: 24, marginRight: 54 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            paddingX: 2,
            paddingY: 1,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "3px 3px 6px #c1c1c1",
            "&:hover": { boxShadow: "4px 4px 8px #b0b0b0" },
          }}
        >
          Imprimir
        </Button>
      </div>

      <div className="print-area" style={{ width: "100%", maxWidth: 800 }}>
        <CredentialPageGroup pages={pages} side={side} cargos={cargos} accesoComputo={accesoComputo} />
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alertSeverity} onClose={() => setAlertOpen(false)} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

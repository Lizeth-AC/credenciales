import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Typography,
  Stack,
  Box,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress
} from "@mui/material";
import DateRangeFilter from "../atoms/DateRangerFilter";
import PrintPageWrapper from "../organisms/PrintPageWrapper";
import CredentialPages from "../organisms/CredentialPageGroup";
import html2pdf from "html2pdf.js";
import AutocompleteCi from "../molecules/AutocompleteCi";

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const CredentialPrintPage = ({ fetchData }) => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedRecinto, setSelectedRecinto] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [accesoComputo, setAccesoComputo] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const printRef = useRef();
  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
        if (!resp.ok) throw new Error("Error al obtener cargos");
        const data = await resp.json();
        setCargos(data);
      } catch (error) {
        console.error(error);
        showAlert("Error al obtener cargos", "error");
      }
    };
    fetchCargos();
  }, []);

  const handleFiltrar = async (accesoValue = accesoComputo) => {
    setLoading(true);

    // Construir parámetros solo si existen
    const inicio = dateRange.start ? dateRange.start.toISOString().slice(0, 10) : "";
    const fin = dateRange.end ? dateRange.end.toISOString().slice(0, 10) : "";
    const cargo = selectedCargo ? selectedCargo.id : "";
    const circunscripcion =
      selectedCargo && selectedCargo.nombre === "NOTARIO ELECTORAL" && selectedRecinto
        ? selectedRecinto
        : "";

    try {
      const result = await fetchData(inicio, fin, cargo, circunscripcion, accesoValue);

      await new Promise((res) => setTimeout(res, 2000));

      if (result.res && Array.isArray(result.personal)) {
        setResultadosFiltrados(result.personal);
        if (result.personal.length === 0) {
          showAlert("No se encontraron resultados.", "info");
        } else {
          showAlert("Resultados filtrados correctamente.", "success");
        }
      } else {
        showAlert("No se encontraron resultados o hubo un error.", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error al filtrar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadPDF = () => {
    if (!printRef.current || loading || resultadosFiltrados.length === 0) return;

    setTimeout(() => {
      const element = printRef.current;
      const options = {
        margin: 0,
        filename: `credenciales_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      html2pdf().set(options).from(element).toPdf().save();
    }, 500);
  };

  const handleOpenWindow = () => {
    const pages = chunkArray(resultadosFiltrados, 9);
    localStorage.setItem('credenciales_preview_pages', JSON.stringify(pages));
    localStorage.setItem('credenciales_preview_acceso', accesoComputo);
    const ids = resultadosFiltrados.map(item => item.id);
    localStorage.setItem('credenciales_preview_ids', JSON.stringify(ids));
    window.open('/preview', '_blank', 'width=900,height=1400');
  };

  const pages = chunkArray(resultadosFiltrados, 9);

  return (
    <Box sx={{ p: 5 }}>
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 2 }}>
        <DateRangeFilter
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
        />

        <PrintPageWrapper
          cargos={cargos}
          selectedCargo={selectedCargo}
          setSelectedCargo={setSelectedCargo}
          selectedRecinto={selectedRecinto}
          setSelectedRecinto={setSelectedRecinto}
        />

        <FormGroup row sx={{ alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label="Acceso a Cómputo"
          />
          <Button
            variant="contained"
            onClick={() => {
              const accesoValue = checked ? 1 : 0;
              setAccesoComputo(accesoValue);
              handleFiltrar(accesoValue);
            }}
          >
            Filtrar
          </Button>
        </FormGroup>
      </Box>

      <Box sx={{ mb: 2 }}>
        <AutocompleteCi
          fetchData={fetchData}
          setResultadosFiltrados={setResultadosFiltrados}
          accesoComputo={checked ? 1 : 0}
          setAccesoComputo={setAccesoComputo} 
        />
      </Box>

      <Grid container spacing={5} alignItems="center" sx={{ mb: 2 }}>
        {resultadosFiltrados.length > 0 && (
          <>
            <Button
              variant="contained"
              onClick={handleDownloadPDF}
              disabled={loading || resultadosFiltrados.length === 0}
            >
              Descargar PDF
            </Button>
            <Button
              variant="outlined"
              sx={{
                ml: 2,
                borderColor: '#888',
                '&:hover': {
                  borderColor: '#aaa',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                }
              }}
              onClick={handleOpenWindow}
            >
              Previsualizar
            </Button>
          </>
        )}
      </Grid>

      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, md: 8 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : resultadosFiltrados.length > 0 ? (
            <Box
              ref={printRef}
              className="a4-page"
              sx={{ p: 0, m: 0, width: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}
            >
              <CredentialPages
                pages={pages}
                cargos={cargos}
                accesoComputo={accesoComputo}
              />
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {dateRange.start && dateRange.end
                ? "No se encontraron credenciales en ese rango."
                : "Selecciona un rango de fechas y presiona Filtrar."}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CredentialPrintPage;
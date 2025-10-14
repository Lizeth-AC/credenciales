import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Button,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
} from "@mui/material";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import CustomDeleteIcon from "../atoms/CustomDeleteIcon";
import CustomEditIcon from "../atoms/CustomEditIcon";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FormularioObservador from "../organisms/FormularioObservador";
import EditarObservador from "./EditObservador";
import { Checkbox } from "@mui/material";
const chunkArray = (array, size = 9) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const ExternoTable = ({ data, onDeleteSuccess }) => {
  const [filters, setFilters] = useState({ tipo: "", activo: "" });
  const [orderBy, setOrderBy] = useState("tipo");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [selectedTokens, setSelectedTokens] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedCi, setSelectedCi] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);

  const handleOpenForm = (item) => {
    setSelectedToken(item.token_acceso);
    setSelectedTipo(item.tipo);
    setOpenForm(true);
  };

  const handleSelectRow = (token) => {
    setSelectedTokens((prev) =>
      prev.includes(token)
        ? prev.filter((t) => t !== token)
        : [...prev, token] 
    );
  };

  const handleCloseForm = () => setOpenForm(false);
  const closeAlert = () => setAlert({ ...alert, open: false });
  // Ordenamiento
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };
  // Filtrado
  const handleFilterChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchTipo = (item.tipo || "").toLowerCase().includes(filters.tipo.toLowerCase());
      const matchActivo =
        filters.activo === ""
          ? true
          : filters.activo === "1"
          ? item.activo === 1
          : item.activo !== 1;
      return matchTipo && matchActivo;
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = (a[orderBy] || "").toString().toLowerCase();
      const valB = (b[orderBy] || "").toString().toLowerCase();
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Exportaciones
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedData.map((item) => ({
        ID: item.id,
        Tipo: item.tipo,
        Activo: item.activo === 1 ? "Sí" : "No",
        Identificador: item.identificador,
        "Org. Política": item.organizacion_politica,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Prensa");
    XLSX.writeFile(wb, "prensa.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Tipo", "Activo", "Identificador", "Org. Política"]],
      body: sortedData.map((item) => [
        item.id,
        item.tipo,
        item.activo === 1 ? "Sí" : "No",
        item.identificador || "-",
        item.organizacion_politica || "-",
      ]),
    });
    doc.save("prensa.pdf");
  };

  const registrarDatos = async (values, { resetForm }) => {
    console.log("Valores del formulario:", values);

    if (!selectedToken) {
      setAlert({ open: true, message: "No se encontró el token del registro", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append("nombre_completo", values.nombre_completo);
      body.append("ci", values.ci);
      if (values.identificador) body.append("identificador", values.identificador);
      if (values.organizacion_politica) body.append("organizacion_politica", values.organizacion_politica);
      if (values.foto) body.append("foto", values.foto);

      console.log("Contenido real de FormData:");
      for (let [key, val] of body.entries()) {
        console.log(key, val);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/activarQr/${selectedToken}`, {
        method: "POST",
        body,
      });

      const data = await response.json();
      console.log("Respuesta backend:", data);
      
      if (data.res === true) {
        setAlert({ open: true, message: "Observador registrado correctamente", severity: "success" });
        handleCloseForm();
        resetForm();
        setTimeout(() => onDeleteSuccess?.(), 4000);
      } else {
        setAlert({ open: true, message: data.msg || "Error al registrar", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: "Error al registrar observador", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const eliminarDatos = async (item) => {
    const token = item?.token_acceso;

    if (!token) {
      setAlert({ open: true, message: "No se encontró el token del registro", severity: "error" });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/liberarToken/${token}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.res === true) {
        setAlert({ open: true, message: data.msg, severity: "success" });
        setTimeout(() => {
          onDeleteSuccess?.();
        }, 3000);
      } else {
        setAlert({ open: true, message: data.msg || "Error al eliminar", severity: "error" });
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      setAlert({ open: true, message: "Error al eliminar Personal", severity: "error" });
    }
  };

  const handlePrevisualizar = async () => {
    if (selectedTokens.length === 0) {
      return setAlert({ open: true, message: "Seleccione al menos un registro", severity: "info" });
    }

    try {
      const query = new URLSearchParams();
      selectedTokens.forEach(token => query.append("tokens[]", token)); 

      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/acceso-externo/listar?${query.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!resp.ok) throw new Error("Error al obtener datos para previsualizar");

      const data = await resp.json();
      const personsArray = Array.isArray(data) ? data : data.datos;
      console.log("Datos obtenidos para previsualizar:", personsArray);
      if (!Array.isArray(personsArray)) {
        setAlert({ open: true, message: "La API no devolvió un array válido", severity: "error" });
        return;
      }

      // Guardamos localStorage igual que antes
      localStorage.setItem("credenciales_preview_pages", JSON.stringify(chunkArray(personsArray, 9)));
      localStorage.setItem("credenciales_preview_acceso", 0);
      localStorage.setItem("credenciales_preview_ids", JSON.stringify(personsArray.map(d => d.qr || d.barcode)));

      window.open("/preview", "_blank", "width=900,height=1400");
    } catch (error) {
      console.error(error);
      setAlert({ open: true, message: "Error al previsualizar", severity: "error" });
    }
  };

  return (
    <Box>
      {/* Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={closeAlert}>
        <Alert severity={alert.severity} onClose={closeAlert} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField size="small" label="Filtrar por Tipo" value={filters.tipo} onChange={handleFilterChange("tipo")} />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Activo</InputLabel>
          <Select value={filters.activo} onChange={handleFilterChange("activo")}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="1">Sí</MenuItem>
            <MenuItem value="0">No</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ ml: "auto" }}>
          <Button onClick={exportToExcel} variant="outlined" size="small">Excel</Button>
          <Button onClick={exportToPDF} variant="outlined" size="small" sx={{ mr: 1 }}>PDF</Button>
          <Button onClick={handlePrevisualizar} variant="outlined" size="small">Previsualizar</Button>
        </Box>
      </Box>

      {/* Tabla */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedTokens.length > 0 &&
                      selectedTokens.length < paginatedData.length
                    }
                    checked={
                      paginatedData.length > 0 &&
                      selectedTokens.length === paginatedData.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTokens(paginatedData.map((item) => item.token_acceso));
                      } else {
                        setSelectedTokens([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === "id"} direction={orderBy === "id" ? order : "asc"} onClick={() => handleSort("id")}>
                    C. I.
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel active={orderBy === "tipo"} direction={orderBy === "tipo" ? order : "asc"} onClick={() => handleSort("tipo")}>
                    Tipo
                  </TableSortLabel>
                </TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Foto</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Sigla</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.token_acceso}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTokens.includes(item.token_acceso)}
                      onChange={() => handleSelectRow(item.token_acceso)}
                    />
                  </TableCell>
                  <TableCell>{item.ci || "-"}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>{item.nombre_completo || "-"}</TableCell>
                  <TableCell>
                    {item.foto ? <img src={`data:image/jpeg;base64,${item.foto}`} alt="foto" width={40} height={40} style={{ borderRadius: "20%" }} /> : item.ci?"Sin foto": "-"}
                  </TableCell>
                  <TableCell>{item.token_acceso || "-"}</TableCell>
                  <TableCell>{item.activo === 1 ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    {item.tipo === "delegado" || item.tipo === "candidato" || item.tipo === "observador"
                      ? item.organizacion_politica || "-"
                      : item.tipo === "prensa"
                      ? item.identificador || "-"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <PersonAddIcon
                        color="primary"
                        onClick={() => {
                          if (item.activo === 0) {
                            setSelectedCi(null);
                            handleOpenForm(item);
                          } else {
                            setAlert({
                              open: true,
                              message: `Ya está asociado a un ${item.tipo}`,
                              severity: "info",
                            });
                          }
                        }}
                        style={{
                          cursor: item.activo === 0 || item.activo === 0 ? "pointer" : "not-allowed",
                          opacity: item.activo === 0 || item.activo === 0 ? 1 : 0.5,
                        }}
                        titleAccess={
                          item.activo === 0 || item.activo === 0
                            ? "Agregar Persona"
                            : `Ya está asociado a un personal de ${item.tipo}`
                        }
                      />
                      <CustomEditIcon 
                        onClick={() => {
                          if (item.activo === 1) {
                            setSelectedCi(item.ci);
                            handleOpenForm(item);
                          } else {
                            setAlert({
                              open: true,
                              message: `No existe personal de ${item.tipo}`,
                              severity: "info",
                            });
                          }
                        }}
                      />
                      <CustomDeleteIcon 
                        onClick={() => {
                          if (item.activo === 1) {
                            eliminarDatos(item)
                          } else {
                            setAlert({
                              open: true,
                              message: `No existe personal de ${item.tipo}`,
                              severity: "info",
                            });
                          }
                        }} 
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogContent>
          {selectedCi ? (
            <EditarObservador
              ci={selectedCi}
              tipo={selectedTipo}
              token={selectedToken}
              onClose={handleCloseForm}
              onUpdate={onDeleteSuccess}
            />
          ) : (
            <FormularioObservador
              onSubmit={registrarDatos}
              loading={loading}
              tipo={selectedTipo}
              onCancel={handleCloseForm}
              celular={false}
            />
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default ExternoTable;

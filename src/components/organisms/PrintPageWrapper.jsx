import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

export default function PrintPageWrapper({
    cargos,
    selectedCargo,
    setSelectedCargo,
    selectedRecinto,
    setSelectedRecinto
}) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 220, width: 220 }}>
                <InputLabel>Cargo</InputLabel>
                <Select
                    value={selectedCargo ? selectedCargo.id : ""}
                    label="Cargo"
                    onChange={e => {
                        const cargo = cargos.find(c => c.id === e.target.value);
                        setSelectedCargo(cargo || null);
                        setSelectedRecinto(""); // Reset recinto if cargo changes
                    }}
                >
                    {cargos.map(c => (
                        <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedCargo?.nombre === "NOTARIO ELECTORAL" && (
                <FormControl size="small" sx={{ minWidth: 170, width: 170 }}>
                    <Select
                        value={selectedRecinto}
                        onChange={e => setSelectedRecinto(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Circunscripción</MenuItem>
                        {["C-2", "C-20", "C-21", "C-22", "C-23", "C-24", "C-25", "C-26", "C-27", "C-28"].map((circun) => (
                            <MenuItem key={circun} value={circun.split("-")[1]}>{circun}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}
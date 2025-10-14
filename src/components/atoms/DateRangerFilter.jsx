import React from "react";
import { TextField, Stack } from "@mui/material";

export default function DateRangeFilter({ startDate, endDate, onChange }) {
    return (
        <>
            {/* Estilo global para forzar el color del icono de calendario */}
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.15) sepia(0.2) saturate(8) hue-rotate(180deg) brightness(0.5) !important;
                }
                input[type="date"]::-ms-input-placeholder {
                    color: #222 !important;
                }
            `}</style>
            <Stack direction="row" spacing={2}>
                <TextField
                    label="Fecha inicio"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                    onChange={e => onChange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                />
                <TextField
                    label="Fecha fin"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                    onChange={e => onChange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                    
                />
                
            </Stack>
        </>
    );
}

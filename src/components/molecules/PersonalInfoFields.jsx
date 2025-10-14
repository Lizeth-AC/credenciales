import React from "react";
import { Grid, Box, Autocomplete, TextField, Typography } from "@mui/material";

import CustomTextField from "../atoms/CustomTextField";


const PersonalInfoFields = () => (
  <>
    <Grid item xs={12}>
      <CustomTextField name="nombres" label="Nombres" onlyLetters required />
    </Grid>

    <Grid container item justifyContent="space-between">
      <Grid item xs={12} md={6} sx={{width:"48%"}}>
        <CustomTextField
          name="apellidoPaterno"
          label="Apellido Paterno"
          onlyLetters
        />
      </Grid>
      <Grid item xs={12} md={6} sx={{width:"48%"}}>
        <CustomTextField
          name="apellidoMaterno"
          label="Apellido Materno"
          onlyLetters
        />
      </Grid>
    </Grid>

    <Grid container item justifyContent="space-between">
      <Grid item xs={12} md={4} sx={{width:"48%"}}>
        <CustomTextField
          name="numeroCarnet"
          label="Número de Carnet"
          onlyNumbers
          required
        />
      </Grid>
      <Grid item xs={12} md={4} sx={{width:"48%"}}>
        <CustomTextField
          name="complemento"
          label="Complemento"
        />
      </Grid>
    </Grid>

    <Grid item xs={12}>
      <CustomTextField
        name="numeroCelular"
        label="Celular (Whatsapp)"
        onlyNumbers
        required
      />
    </Grid>
    
  </>
);

export default PersonalInfoFields;

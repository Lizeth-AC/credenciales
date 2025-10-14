import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import CustomTextField from "../atoms/CustomTextField";
import CustomUploadImage from "../atoms/CustomUploadImage";
import { useFormikContext } from "formik";

const SeccionUploadImage = () => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <Grid item xs={12} sx={{width:"100%"}}>
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: "#FCF8E3",
            border: "1px solid #FAD17F",
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
          }}
        >
          <WarningIcon sx={{ color: "#976d18ff" }} />
          <Typography fontSize="0.9rem" color="#976d18ff">
            La imagen debe ser 4x4 cm, fondo blanco, sin sombreros ni lentes.
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{width:"100%"}}>
        <CustomUploadImage
          name="imagen"
          label="Clic para subir imagen"
          selectedFile={values.imagen}
          handleFileChange={(e) => {
            const file = e.target.files[0];
            setFieldValue("imagen", file);
          }}
          required
        />

      </Grid>

      <Grid item xs={12} sx={{width:"100%"}}>
        <CustomTextField
          name="codVerificacion"
          label="Código de verificación"
          onlyNumbers
          required
        />
      </Grid>

      <Grid item xs={12} sx={{width:"100%"}}>
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: "#c4e8fcff",
            border: "1px solid #5FC7FC",
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
          }}
        >
          <WarningIcon sx={{ color: "#186a92ff", fontSize: "3rem", pl:3}} />
          <Typography fontSize="0.95rem" color="#186a92ff" textAlign="center" sx={{ lineHeight: 1.2}}>
            Nota: si desea actualizar datos de su registro debe volver
            a registrarse.
          </Typography>
        </Box>
      </Grid>
    </>
  );
};

export default SeccionUploadImage;

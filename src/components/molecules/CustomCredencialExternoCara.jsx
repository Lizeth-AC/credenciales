import { Box, Typography } from "@mui/material";

const CustomCredencialExternoCara = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
      className="credencial"
      sx={{
        width: "6cm",
        height: "9cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_ACCESO_COMPUTO_EG2025.png'
          : null})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: "8pt",
        overflow: "hidden"
      }}
    >
      {lado === 'anverso' && (
        <>
          <Typography
            sx={{
              position: "absolute",
              lineHeight:"1",
              top: "2.5cm",
              left: 0,
              width: "100%",
              fontWeight:780,
              textAlign: "center",
              fontSize: "6pt"
            }}
          >
            {safePersona.cargo_nombre}
          </Typography>
          <img
            src={`data:image/jpeg;base64,${safePersona.photo}`}
            alt="foto"
            style={{
              position: "absolute",
              top: "2.85cm",
              left: "1.92cm",
              width: "2.35cm",
              height: "2.3cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "5.25cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "8pt",
              lineHeight: "0.9",
            }}
          >
            {safePersona.nombre+" "+safePersona.paterno+" "+safePersona.materno}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "0.72cm",
              left: "3.5cm",
              width: "100%",
              fontSize: "8pt"
            }}
          >
            {safePersona.ci}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencialExternoCara;

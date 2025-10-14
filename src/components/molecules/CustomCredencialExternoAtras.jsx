import { Box, Typography } from "@mui/material";

const CustomCredencialExternoAtras = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );
  console.log("CREDENCIAL EXTERNO ATRAS", safePersona);
  const rawSvg = safePersona.barcode;
  const cleanedSvg = rawSvg.replace(/<text[^>]*>[\s\S]*?<\/text>/g, '');
  const svgBase64 = btoa(unescape(encodeURIComponent(cleanedSvg)));

  return (
    <Box
      className="credencial"
      sx={{
        width: "6cm",
        height: "9cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' ?'/credenciales/ATRAS_ACCESO_COMPUTO_EG2025.png': null})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: "8pt",
        overflow: "hidden"
      }}
    >
      {lado === 'anverso' && (
      <>
        <Box
            sx={{
              position: "absolute",
              top: "1.33cm",
              left: "3.16cm",
              width: "2.6cm",
              height: "6%",
              display: "flex",
              flexDirection: "column",
              fontFamily: "Times New Roman, serif",
            }}
          >
            <Typography
            sx={{
              position: "absolute",
              lineHeight:"1",
              width: "100%",
              fontWeight:780,
              fontSize: "6pt"
            }}
          >
            {safePersona.cargo_nombre}
          </Typography>
          </Box>
          <img
            src={`data:image/svg+xml;base64,${safePersona.qr}`}
            alt="QR"
            style={{
              position: "absolute",
              top: "4.52cm",
              left: "1.8cm",
              width: "2.52cm",
              height: "2.52cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "7.15cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "5pt",
              lineHeight: 1
            }}
          >
            {safePersona.nombre+" "+safePersona.paterno+" "+safePersona.materno}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencialExternoAtras;
import { Box, Typography } from "@mui/material";

const CustomCredencialQR = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

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
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_QR_EG2025.png'
          : '/credenciales/ATRAS_QR_EG2025.jpg'})`,
        backgroundSize: "100% 100%", 
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        fontSize: "8pt",
        fontFamily: "Times New Roman, serif",
        overflow: "hidden",
      }}
    >
      {lado === 'anverso' && (
        <>
          <img
            src={`data:image/svg+xml;base64,${safePersona.qr}`}
            alt="QR"
            style={{
              position: "absolute",
              top: "3.05cm",
              left: "1.9cm",
              width: "2.4cm",
              height: "2.4cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "6.1cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "8pt",
              lineHeight: 1
            }}
          >
            {safePersona.nombre+" "+safePersona.paterno+" "+safePersona.materno}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "1.95cm",
              left: "3.5cm",
              width: "100%",
              fontSize: "7.2pt"
            }}
          >
            {safePersona.ci}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "0",
              height: "0.45cm",
              textAlign: "center",
              width: "100%",
              fontWeight:"700",
              fontSize: "6pt",
              color:"white",
              bgcolor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
            }}
          >
            {"Válido Elecciones Generales 2025"}
          </Typography>
        </>
      )}
      {lado === 'reverso' && (
        <>
          <img
            src={`data:image/svg+xml;base64,${svgBase64}`}
            alt="Código de barras"
            style={{
              position: "absolute",
              top: "7.5cm",
              paddingLeft: "0.5cm",
              paddingRight: "0.5cm",
              width: "100%",
              height: "0.9cm",
              objectFit: "cover",
              backgroundColor: "#fff",
            }}
          />
        </>
      )}
    </Box>
  );
};

export default CustomCredencialQR;

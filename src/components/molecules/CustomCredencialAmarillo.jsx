import { Box} from "@mui/material";

const CustomCredencialAmarillo = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  const rawSvg = persona?.barcode || "";
const cleanedSvg = rawSvg.replace(/<text[^>]*>[\s\S]*?<\/text>/g, '');

  return (
    <Box
      sx={{
        width: "6cm",
        height: "9cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso'
          ? '/credenciales/CARA_PRENSA_EG2025.jpg'
          : '/credenciales/ATRAS_PRENSA_EG2025.jpg'})`,
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
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "6cm",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Times New Roman, serif",
              textAlign: "center",
            }}
          >
            <img
              src={`data:image/svg+xml;base64,${safePersona.qr}`}
              alt="QR"
              style={{
                position: "absolute",
                top: "2.2cm",
                left: "1.6cm",
                width: "2.8cm",
                height: "2.8cm",
                objectFit: "cover"
              }}
            />
          </Box>
          <img
            src={`/EleccionesLogo.png`}
            alt="foto"
            style={{
              position: "absolute",
              bottom: "0.4cm",
              left: "1cm",
              width: "4cm",
              objectFit: "cover",
            }}
          />
        </>
      )}
      {lado === 'reverso' && (
        <>
          <img
            src={`data:image/svg+xml;base64,${cleanedSvg}`}
            alt="Código de barras"
            style={{
              position: "absolute",
              top: "7.5cm",
              paddingLeft: "0.5cm",
              paddingRight: "0.5cm",
              width: "100%",
              height: "0.75cm",
              objectFit: "cover",
              backgroundColor: "#fff",
            }}
          />
        </>
      )}
    </Box>
  );
};

export default CustomCredencialAmarillo;
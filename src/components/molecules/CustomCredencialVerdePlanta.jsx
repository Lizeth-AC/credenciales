import { Box, Typography } from "@mui/material";

const CustomCredencialVerde = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
      className="credencial"
      sx={{
        width: "9cm",
        height: "5.5cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_EVENTUAL_2025.png'
          : '/credenciales/ATRAS_EVENTUAL_2025.png'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: "8pt",
        fontFamily: "Times New Roman, serif",
        overflow: "hidden"
      }}
    >
      {lado === 'anverso' && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "3.6cm",
              right: 0,
              width: "5.2cm",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              lineHeight: 0,
            }}
          >
            {/* CI */}
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "7pt",
                lineHeight: 1,
                fontFamily: "Source Sans Pro, sans-serif",
                mt: "0.5mm",
              }}
            >
              {"CI: " + safePersona.ci}
            </Typography>

            {/* Nombre */}
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "6pt",
                fontFamily: "Source Sans Pro, sans-serif",
                whiteSpace: "normal",
                wordBreak: "break-word",
                lineHeight: 1,
              }}
            >
              {safePersona.nombre} {safePersona.paterno} {safePersona.materno}
            </Typography>

            {/* Cargo */}
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "6pt",
                lineHeight: 1,
                fontFamily: "Lato, sans-serif",
              }}
            >
              {safePersona.cargo_nombre}
            </Typography>
          </Box>
          <img
                src={`/credenciales/qr.png`}
                alt="foto"
                style={{
                    position: "absolute",
                    top: "3.1cm",
                    left: "1.25cm",
                    width: "1.5cm",
                    height: "1.5cm",
                    objectFit: "cover",
                }}
            />
            <img
                src={`/TEDLogo.jpg`}
                alt="foto"
                style={{
                    position: "absolute",
                    top: "1.1cm",
                    left: "0.7cm",
                    width: "2.5cm",
                    objectFit: "cover",
                }}
            />
          <img
              src={`data:image/jpeg;base64,${safePersona.photo}`}
              alt="foto"
              style={{
                position: "absolute",
                top: "1cm",
                left: "5.3cm",
                width: "2.6cm",
                height: "2.6cm",
                objectFit: "cover",
              }}
            />
            
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "0.1cm",
                    width: "100%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "10pt",
                    color:"white",
                    textAlign:"center",
                    fontFamily: "Source Sans Pro, sans-serif",
                }}
            >
                {safePersona.cargo_nombre==="ASISTENTE ADMINISTRATIVA"?"SERVIDOR PÚBLICO":"SERVIDOR PÚBLICO"}
            </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencialVerde;

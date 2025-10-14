import { Box, Typography } from "@mui/material";

const CustomCredencialBlanco = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
  sx={{
    width: "6cm",
    height: "9cm",
    position: "relative",
    backgroundImage: `url(${lado === 'anverso'
      ? '/credenciales/CARA_JUEZELECTORAL_EG2025.jpg'
      : '/credenciales/ATRAS_JUEZELECTORAL_EG2025.jpg'})`,
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
           <Typography
              fontWeight="800"
              sx={{
                position: "absolute",
                bottom: "2.2cm",
                padding: "0.06cm",
                lineHeight: 1,
                fontSize: "9pt",
                fontFamily: "Source Sans Pro, sans-serif",
                backgroundColor: "#FFFFFF",
                width: "72%",
              }}
            >
              {safePersona.cargo_nombre}
            </Typography>

            {/* Nombre */}
            <Typography
              fontWeight="800"
              sx={{
                position: "absolute",
                top: "6.85cm",
                lineHeight: 1,
                fontSize: "5.7pt",
                fontFamily: "Source Sans Pro, sans-serif",
              }}
            >
              {safePersona.nombre + " " + safePersona.paterno + " " + safePersona.materno}
            </Typography>

            {/* CI */}
            <Typography
              sx={{
                position: "absolute",
                top: "7.05cm",
                fontWeight: 800,
                fontSize: "6pt",
                fontFamily: "Source Sans Pro, sans-serif",
              }}
            >
              {"CI: "+safePersona.ci}
            </Typography>

            {/* Validez */}
            
          </Box>
           <img
              src={`data:image/jpeg;base64,${safePersona.photo}`}
              alt="foto"
              style={{
                position: "absolute",
                top: "2.13cm",
                left: "1.5cm",
                width: "3cm",
                height: "3cm",
                objectFit: "cover",
              }}
            />
            <img
              src={`/EleccionesLogo.png`}
              alt="foto"
              style={{
                position: "absolute",
                bottom: "0.55cm",
                left: "2cm",
                width: "2.3cm",
                objectFit: "cover",
              }}
            />
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
              bgcolor: "#3A3A35",
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
                <Typography
              fontWeight="800"
              sx={{
                position: "absolute",
                top: "3.22cm",
                left: "2.9cm",
                padding: "0.06cm",
                lineHeight: 1,
                fontSize: "4.5pt",
                fontFamily: "Source Sans Pro, sans-serif",
                backgroundColor: "#FFFFFF"
              }}
            >
              {safePersona.cargo_nombre}
            </Typography>
                  
              </>
            )}
    </Box>
  );
};

export default CustomCredencialBlanco;

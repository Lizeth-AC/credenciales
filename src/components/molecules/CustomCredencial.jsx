import { Box, Typography } from "@mui/material";

const CustomCredencial = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
      className="credencial"
      sx={{
        width: "6.2cm",
        height: "8.5cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_EVENTUAL_EG2020_4-.png'
          : '/credenciales/ATRAS_EVENTUAL_EG2020_4.png'})`,
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
              top: "2.9cm",
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
              top: "3.27cm",
              left: "2.12cm",
              width: "1.9cm",
              height: "1.9cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "5.22cm",
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
              bottom: "0.56cm",
              left: "4.7cm",
              width: "100%",
              fontSize: "7pt"
            }}
          >
            {safePersona.ci}
          </Typography>
            <img
                src={`/EleccionesLogo.png`}
                alt="foto"
                style={{
                    position: "absolute",
                    top: "6.2cm",
                    left: "0.2cm",
                    width: "3.5cm",
                    height: "1.7cm",
                    objectFit: "cover",
                    backgroundColor: "transparent",
                }}
            />
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "0.05cm",
                    left: "0.5cm",
                    width: "70%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "6pt",
                    color:"white"
                }}
            >
                {"Válido Elecciones Generales 2025"}
            </Typography>
        </>
      )}
      {lado === 'reverso' && (
        <>
          <Typography
            sx={{
              position: "absolute",
              top: "2.9cm",
              left: "1.8cm",
              width: "70%",
              lineHeight:"1.3",
              fontWeight:"800",
              fontSize: "6pt"
            }}
          >
            {safePersona.cargo_nombre}
          </Typography>
            <img
                src={`/credenciales/qr.png`}
                alt="foto"
                style={{
                    position: "absolute",
                    top: "5.5cm",
                    left: "4.1cm",
                    width: "1.8cm",
                    height: "1.8cm",
                    objectFit: "cover",
                }}
            />

            <Typography
                sx={{
                    position: "absolute",
                    top: "0.5cm",
                    left: "5cm",
                    width: "70%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "12pt",
                    color:"white"
                }}
            >
                {safePersona.cargo_nombre=="NOTARIO ELECTORAL"?"C"+safePersona.ciexterno:""}
            </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencial;

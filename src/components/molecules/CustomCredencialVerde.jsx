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
              top: 0,
              right: 0,
              width: "5.2cm",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Times New Roman, serif",
              textAlign: "center",
              // backgroundColor:"red"
            }}
          >
            
            <Typography
              sx={{
                position: "absolute",
                top: "4.2cm",
                fontWeight: 800,
                fontSize: "5.8pt",
                fontFamily: "Lato, sans-serif",
              }}
            >
              {safePersona.cargo_nombre}
            </Typography>

            {/* Nombre */}
            <Typography
              fontWeight="800"
              sx={{
                position: "absolute",
                top: "4.02cm",
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
                top: "3.7cm",
                fontWeight: 800,
                fontSize: "6pt",
                fontFamily: "Source Sans Pro, sans-serif",
              }}
            >
              {"CI: "+safePersona.ci}
            </Typography>
            
          </Box>
          <Box
              sx={{
              position: "absolute",
              top: "1.4cm",
              left: "2cm",
              width: "0.025cm",
              height: "1.2cm",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              backgroundColor:"primary.main"
            }}
            ></Box>
          <img
                src={`/EleccionesLogo.png`}
                alt="foto"
                style={{
                    position: "absolute",
                    top: "1.6cm",
                    left: "0.2cm",
                    width: "1.6cm",
                    objectFit: "cover",
                }}
            />
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
                    top: "1.5cm",
                    left: "2.1cm",
                    width: "1.5cm",
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
                    bottom: "0.35cm",
                    width: "100%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "7pt",
                    color:"white",
                    textAlign:"center",
                    fontFamily: "Source Sans Pro, sans-serif",
                }}
            >
                {safePersona.cargo_nombre==="ASISTENTE ADMINISTRATIVA"?"PERSONAL EVENTUAL":"PERSONAL EVENTUAL"}
            </Typography>
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "0.09cm",
                    width: "100%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "7pt",
                    color:"white",
                    textAlign:"center",
                    fontFamily: "Source Sans Pro, sans-serif",
                }}
            >
                {"ELECCIONES GENERALES 2025"}
            </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencialVerde;

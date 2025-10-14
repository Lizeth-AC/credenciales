import NavBar from "../components/NavBar";
import LateralBar from "../components/LateralBar";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { useState, createContext } from "react";

export const LateralBarContext = createContext({ lateralOpen: true });

const anchoCaja = 200;

const Layout = () => {
  const [lateralOpen, setLateralOpen] = useState(true);

  return (
    <LateralBarContext.Provider value={{ lateralOpen, setLateralOpen }}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <NavBar anchoCaja={anchoCaja} />
        <LateralBar anchoCaja={anchoCaja} open={lateralOpen} setOpen={setLateralOpen} />

        <Box
          sx={{
            flexGrow: 1,
            mt: 3,
            ml: lateralOpen ? `${anchoCaja}px` : '0px',
            transition: 'margin-left 0.3s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            px: 2,
          }}
        >
          <Box
            sx={{
              width: lateralOpen ? '98%' : '100%',
              maxWidth: '1200px',
              minHeight: 'calc(100vh - 64px)', // 64px por si tu Toolbar tiene esa altura
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              p: '0.5cm',
              transition: 'width 0.3s ease',
            }}
          >
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </LateralBarContext.Provider>
  );
};

export default Layout;

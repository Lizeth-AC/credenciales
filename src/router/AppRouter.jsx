import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PreviewPage from '../pages/PreviewCredenciales';
import Layout from '../Layout/Layout';
import Login from '../pages/Login/Login';
import CredencialPage from '../pages/CredencialPage';

import ListaCredenciales from '../pages/Usuarios/ListaCredenciales';
import CredencialIndividual from '../pages/Usuarios/CredencialIndividual';

import GestionarUnidad from '../pages/Organizacion/GestionarUnidad';
import GestionarCargo from '../pages/Organizacion/GestionarCargo';
import GestionarExterno from '../pages/Organizacion/GestionarExterno';
import ListaCredencialesExterno from '../pages/Usuarios/ListaCredencialesExterno';
import AccesoComputo from '../pages/AccesoComputo';
import AccesoObservador from '../pages/AccesoObservador';
import QRScanner from '../pages/QRScanner'; // 👈 Asegúrate de importar el componente
import PrivateRoute from '../pages/Login/PrivateRoute';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/accesoComputo/:token" element={<AccesoComputo />} />
        <Route path="/accesoObservador/:token" element={<AccesoObservador />} />
        <Route path="/qr" element={<QRScanner />} /> {/* 👈 Ruta al escáner */}

        {/* Redirección según tipo de dispositivo */}
        <Route
          path="/"
          element={
            isMobile()
              ? <Navigate to="/qr" />
              : <Navigate to="/Inicio" />
          }
        />

        {/* Rutas privadas solo para escritorio */}
        {!isMobile() && (
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/Inicio" element={<CredencialPage />} />
              <Route path="/Lista_Credenciales" element={<ListaCredenciales />} />
              <Route path="/Lista_Externo" element={<ListaCredencialesExterno />} />
              <Route path="/Credencial_Individual" element={<CredencialIndividual />} />
              <Route path="/Gestionar_Unidad" element={<GestionarUnidad />} />
              <Route path="/Gestionar_Cargo" element={<GestionarCargo />} />
              <Route path="/Gestionar_Externo" element={<GestionarExterno />} />
            </Route>
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import KontrolnaTablaUserStranica from "./pages/kontrolna_tabla/KontrolnaTablaUserStranica";
import KontrolnaTablaAdminStranica from "./pages/kontrolna_tabla/KontrolnaTablaAdminStranica";
import ProfilnaStranica from "./pages/profile/ProfilnaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { usersApi } from "./api_services/users/UsersAPIService";
import { messageApi } from "./api_services/messages/MessageAPIService";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route
        path="/register"
        element={<RegistracijaStranica authApi={authApi} />}
      />
      <Route path="/404" element={<NotFoundStranica />} />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <KontrolnaTablaUserStranica
              usersApi={usersApi}
              messageService={messageApi}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <KontrolnaTablaAdminStranica
              usersApi={usersApi}
              messageService={messageApi}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilnaStranica />
          </ProtectedRoute>
        }
      />

      {/* Preusmerava na dashboard kao default rutu */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all ruta za nepostojeće stranice */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;

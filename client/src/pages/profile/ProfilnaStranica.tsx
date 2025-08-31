import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import { ProfilePage } from "../../components/profile/ProfilePage";

export default function ProfilnaStranica() {
  const { isAuthenticated, logout, token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, token, logout, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md border border-gray-300 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4 text-center">Мој профил</h1>
        {user && token && <ProfilePage />}
      </div>
    </main>
  );
}

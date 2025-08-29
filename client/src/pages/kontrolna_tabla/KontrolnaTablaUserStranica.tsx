import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PročitajVrednostPoKljuču,
  ObrišiVrednostPoKljuču,
} from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import { TabelaKorisnika } from "../../components/kontrolna_tabla/TabelarniPrikazKorisnika/TabelaKorisnika";
import { ChatWindow } from "../../components/chat/ChatWindow";
import type { UserDto } from "../../models/users/UserDto";

interface KontrolnaTablaUserStranicaProps {
  usersApi: IUsersAPIService;
}

export default function KontrolnaTablaUserStranica({
  usersApi,
}: KontrolnaTablaUserStranicaProps) {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const localToken = PročitajVrednostPoKljuču("authToken");
    if (!isAuthenticated || !localToken) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex flex-col items-center justify-start p-6 space-y-6">
      <div className="w-full max-w-6xl flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 bg-red-700/60 hover:bg-red-700/70 text-white py-2 rounded-xl transition"
        >
          Напусти контролну таблу
        </button>
      </div>

      <div className="flex w-full max-w-6xl space-x-6">
        <div className="flex-1">
          <TabelaKorisnika
            usersApi={usersApi}
            role="user"
            selectedUserId={selectedUser?.id ?? null}
            onSelectUser={(user) => setSelectedUser(user)}
          />
        </div>

        <div className="flex-1 h-[500px]">
          {selectedUser && token && (
            <ChatWindow token={token} otherUserId={selectedUser.id} />
          )}
        </div>
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PročitajVrednostPoKljuču,
  ObrišiVrednostPoKljuču,
} from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/UseAuthHook";
import type { IUsersAPIService } from "../../api_services/users/IUsersAPIService";
import type { IMessageAPIService } from "../../api_services/messages/IMessageAPIService";
import type { UserDto } from "../../models/users/UserDto";
import type { Conversation } from "../../types/messages/Conversation";
import { TabelaKorisnika } from "../../components/kontrolna_tabla/TabelarniPrikazKorisnika/TabelaKorisnika";
import { ChatWindow } from "../../components/chat/ChatWindow";

interface Props {
  usersApi: IUsersAPIService;
  messageService: IMessageAPIService;
}

export default function KontrolnaTablaAdminStranica({
  usersApi,
  messageService,
}: Props) {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();

  const [korisnici, setKorisnici] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const localToken = PročitajVrednostPoKljuču("authToken");
    if (!isAuthenticated || !localToken) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  useEffect(() => {
    (async () => {
      if (!token) return;

      const data = await usersApi.getSviAdmini(token);
      setKorisnici(data);
    })();
  }, [token, usersApi]);

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const res = await messageService.getConversations(token);
        if (res.success) {
          setConversations(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    })();
  }, [token, messageService]);

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-start justify-center p-6 gap-6">
      <div className="flex flex-col w-full max-w-2xl">
        <TabelaKorisnika
          usersApi={usersApi}
          role="admin"
          selectedUserId={selectedUser?.id ?? null}
          onSelectUser={setSelectedUser}
          conversations={conversations}
        />

        <button
          onClick={handleLogout}
          className="mt-4 px-4 bg-red-700/60 hover:bg-red-700/70 text-white py-2 rounded-xl transition"
        >
          Напусти контролну таблу
        </button>
      </div>

      {selectedUser && token && (
        <>
          {console.log("Selected user:", selectedUser)}
          <ChatWindow token={token} otherUserId={selectedUser.id} />
        </>
      )}
    </main>
  );
}

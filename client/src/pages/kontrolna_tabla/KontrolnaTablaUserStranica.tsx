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

export default function KontrolnaTablaUserStranica({
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

  // Fetch full user users
  useEffect(() => {
    (async () => {
      if (!token) return;

      try {
        const data: UserDto[] = await usersApi.getSviObicniKorisnici(token);
        setKorisnici(data);
      } catch (err) {
        console.error("Failed to fetch user users:", err);
      }
    })();
  }, [token, usersApi]);

  // Fetch conversations function
  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await messageService.getConversations(token);
      if (res.success) setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [token, messageService]);

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-start justify-center p-6 gap-6">
      <div className="flex flex-col w-full max-w-4xl">
        <TabelaKorisnika
          usersApi={usersApi}
          role="user"
          selectedUserId={selectedUser?.id ?? null}
          onSelectUser={setSelectedUser}
          conversations={conversations}
        />

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleGoToProfile}
            className="px-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
          >
            Моj профил
          </button>

          <button
            onClick={handleLogout}
            className="px-4 bg-red-700/60 hover:bg-red-700/70 text-white py-2 rounded-xl transition"
          >
            Напусти контролну таблу
          </button>
        </div>
      </div>

      {selectedUser && token && (
        <ChatWindow
          token={token}
          otherUserId={selectedUser.id}
          onMessagesRead={fetchConversations} // <-- refresh unread count automatically
        />
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import type { IUsersAPIService } from "../../../api_services/users/IUsersAPIService";
import type { UserDto } from "../../../models/users/UserDto";
import { RedUTabeliKorisnika } from "./RedUTabeliKorisnika";
import { useAuth } from "../../../hooks/auth/UseAuthHook";

export interface TabelaKorisnikaProps {
  usersApi: IUsersAPIService;
  role?: "admin" | "user";
  selectedUserId?: number | null;
  onSelectUser: (user: UserDto) => void;
  conversations: {
    otherUserId: number;
    lastMessage: string;
    unreadCount: number;
  }[];
}

export function TabelaKorisnika({
  usersApi,
  role,
  onSelectUser,
  selectedUserId,
  conversations,
}: TabelaKorisnikaProps) {
  const [korisnici, setKorisnici] = useState<UserDto[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    (async () => {
      if (!token) return;

      let data: UserDto[] = [];
      if (role === "admin") data = await usersApi.getSviAdmini(token);
      else if (role === "user")
        data = await usersApi.getSviObicniKorisnici(token);
      else data = await usersApi.getSviKorisnici(token);

      // Exclude the current user
      if (user) {
        data = data.filter((u) => u.id !== user.id);
      }

      setKorisnici(data);
    })();
  }, [token, usersApi, role, user]);

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-gray-300 shadow-xl rounded-2xl p-6 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Списак корисника
      </h2>
      <table className="w-full table-auto border-collapse text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Profile Pic</th>
            <th className="px-4 py-2">Unread</th>
          </tr>
        </thead>
        <tbody>
          {korisnici.length > 0 ? (
            korisnici.map((korisnik) => {
              const conv = conversations.find(
                (c) => c.otherUserId === korisnik.id
              );
              const unreadCount = conv?.unreadCount ?? 0;

              return (
                <RedUTabeliKorisnika
                  key={korisnik.id}
                  korisnik={korisnik}
                  onSelectUser={onSelectUser}
                  isSelected={korisnik.id === selectedUserId}
                  unreadCount={unreadCount}
                />
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-4">
                Нема корисника за приказ.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

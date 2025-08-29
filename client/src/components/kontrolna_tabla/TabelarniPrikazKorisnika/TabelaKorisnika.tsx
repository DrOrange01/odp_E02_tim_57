import { useEffect, useState } from "react";
import type { IUsersAPIService } from "../../../api_services/users/IUsersAPIService";
import type { UserDto } from "../../../models/users/UserDto";
import { RedUTabeliKorisnika } from "./RedUTabeliKorisnika";
import { useAuth } from "../../../hooks/auth/UseAuthHook";
import { ObrišiVrednostPoKljuču } from "../../../helpers/local_storage";

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
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      let data: UserDto[] = [];
      if (role === "admin") data = await usersApi.getSviAdmini(token ?? "");
      else if (role === "user")
        data = await usersApi.getSviObicniKorisnici(token ?? "");
      else data = await usersApi.getSviKorisnici(token ?? "");
      setKorisnici(data);
    })();
  }, [token, usersApi, role]);

  return (
    <div className="bg-white/30 backdrop-blur-lg border border-gray-300 shadow-xl rounded-2xl p-6 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Списак корисника
      </h2>
      <table className="w-full table-auto border-collapse text-left">
        <thead></thead>
        <tbody>
          {korisnici.length > 0 ? (
            korisnici.map((korisnik) => {
              const conv = conversations.find(
                (c) => c.otherUserId === korisnik.id
              );
              const unreadCount = conv?.unreadCount ?? 0;

              return (
                <tr
                  key={korisnik.id}
                  onClick={() => onSelectUser(korisnik)}
                  className={`cursor-pointer ${
                    selectedUserId === korisnik.id ? "bg-blue-100" : ""
                  }`}
                >
                  <td className="px-4 py-2">{korisnik.id}</td>
                  <td className="px-4 py-2 flex items-center justify-between">
                    {korisnik.korisnickoIme}
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs px-2 py-1 bg-red-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">{korisnik.uloga}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                Нема корисника за приказ.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

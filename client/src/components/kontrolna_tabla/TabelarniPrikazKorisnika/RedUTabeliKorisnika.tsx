import type { UserDto } from "../../../models/users/UserDto";

interface RedUTabeliKorisnikaProps {
  korisnik: UserDto;
  onSelectUser?: (user: UserDto) => void;
  isSelected?: boolean;
  unreadCount?: number;
}

export function RedUTabeliKorisnika({
  korisnik,
  onSelectUser,
  isSelected,
  unreadCount = 0,
}: RedUTabeliKorisnikaProps) {
  return (
    <tr
      onClick={() => onSelectUser?.(korisnik)}
      className={`cursor-pointer ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      <td className="px-4 py-2">{korisnik.korisnickoIme}</td>
      <td className="px-4 py-2">{korisnik.first_name}</td>
      <td className="px-4 py-2">{korisnik.last_name}</td>
      <td className="px-4 py-2">{korisnik.phone_number}</td>
      <td className="px-4 py-2">
        {korisnik.profile_pic ? (
          <img
            src={korisnik.profile_pic}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-2">
        {unreadCount > 0 && (
          <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </td>
    </tr>
  );
}

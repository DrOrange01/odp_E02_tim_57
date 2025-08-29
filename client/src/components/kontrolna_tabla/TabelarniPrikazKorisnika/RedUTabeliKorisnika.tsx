import type { UserDto } from "../../../models/users/UserDto";

interface RedUTabeliKorisnikaProps {
  korisnik: UserDto;
  onSelectUser?: (user: UserDto) => void;
  isSelected?: boolean;
}

export function RedUTabeliKorisnika({
  korisnik,
  onSelectUser,
  isSelected,
}: RedUTabeliKorisnikaProps) {
  return (
    <tr
      onClick={() => onSelectUser?.(korisnik)}
      className={`cursor-pointer ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      <td className="px-4 py-2">{korisnik.id}</td>
      <td className="px-4 py-2">{korisnik.korisnickoIme}</td>
      <td className="px-4 py-2">{korisnik.uloga}</td>
    </tr>
  );
}

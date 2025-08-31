import { UserDto } from "../../DTOs/users/UserDto.ts";
import { User } from "../../models/User.ts";
export interface IUserService {
  /**
   * Vraca listu svih korisnika u sistemu.
   * @returns Podatke o korisnicima u vidu liste.
   */
  getSviKorisnici(): Promise<UserDto[]>;
  getSviAdmini(): Promise<UserDto[]>;
  getSviAdminiFull(): Promise<User[]>;
  getSviObicniKorisnici(): Promise<UserDto[]>;
  updateProfile(userId: number, data: Partial<User>): Promise<UserDto>;
}

 import type { UserDto } from "../../models/users/UserDto";
import type { User } from "../../types/users/User";

export interface IUsersAPIService {
  getSviKorisnici(token: string): Promise<UserDto[]>;
  getSviAdmini(token: string): Promise<UserDto[]>;
  getSviObicniKorisnici(token: string): Promise<UserDto[]>;

  updateProfile(token: string, userData: FormData): Promise<User>;
} 
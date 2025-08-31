import type { UserDto } from "../../models/users/UserDto";
import type { User } from "../../types/users/User";

/**
 * Interfejs za korisnicki servis.
 */
export interface IUsersAPIService {
  getSviKorisnici(token: string): Promise<UserDto[]>;
  getSviAdmini(token: string): Promise<UserDto[]>;
  getSviObicniKorisnici(token: string): Promise<UserDto[]>;
  updateProfile(
    token: string,
    userData: {
      first_name: string;
      last_name: string;
      phone_number: string;
      profile_pic: string;
    }
  ): Promise<User>;
}

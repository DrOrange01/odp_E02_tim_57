import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { User } from "../../Domain/models/User";
import type { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import type { IUserService } from "../../Domain/services/users/IUserService";
export class UserService implements IUserService {
  public constructor(private userRepository: IUserRepository) {}
  async getSviKorisnici(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    const korisniciDto: UserDto[] = korisnici.map(
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga)
    );
    return korisniciDto;
  }
}

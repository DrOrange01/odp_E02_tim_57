import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { User } from "../../Domain/models/User";
import type { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import type { IUserService } from "../../Domain/services/users/IUserService";

export class UserService implements IUserService {
  public constructor(private userRepository: IUserRepository) {}

  async getSviKorisnici(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    return korisnici.map(
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga)
    );
  }

  async getSviAdmini(): Promise<UserDto[]> {
    const admini: User[] = await this.userRepository.getByRole("admin");
    return admini.map(
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga)
    );
  }

  async getSviAdminiFull(): Promise<User[]> {
    return await this.userRepository.getByRole("admin");
  }

  async getSviObicniKorisnici(): Promise<UserDto[]> {
    const obicniKorisnici: User[] = await this.userRepository.getByRole("user");
    return obicniKorisnici.map(
      (user) => new UserDto(user.id, user.korisnickoIme, user.uloga)
    );
  }

  async updateProfile(userId: number, data: Partial<User>): Promise<UserDto> {
    const updatedUser: User = await this.userRepository.updatePartial(
      userId,
      data
    );

    return new UserDto(
      updatedUser.id,
      updatedUser.korisnickoIme,
      updatedUser.uloga,
      updatedUser.first_name,
      updatedUser.last_name,
      updatedUser.phone_number,
      updatedUser.profile_pic
    );
  }
}

 import { UserDto } from "../../Domain/DTOs/users/UserDto";
import { User } from "../../Domain/models/User";
import type { IUserRepository } from "../../Domain/repositories/users/IUserRepository";
import type { IUserService } from "../../Domain/services/users/IUserService";
import type { IFileStorageService } from "../../Domain/services/files/IFileStorageService";
import type multer from "multer";

export class UserService implements IUserService {
  public constructor(
    private userRepository: IUserRepository,
    private fileStorage: IFileStorageService
  ) {}

  async getSviKorisnici(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    return korisnici.map(
      (u) =>
        new UserDto(
          u.id,
          u.korisnickoIme,
          u.uloga,
          u.first_name,
          u.last_name,
          u.phone_number,
          u.profile_pic
        )
    );
  }

  async getSviAdmini(): Promise<UserDto[]> {
    const admini: User[] = await this.userRepository.getByRole("admin");
    return admini.map(
      (u) =>
        new UserDto(
          u.id,
          u.korisnickoIme,
          u.uloga,
          u.first_name,
          u.last_name,
          u.phone_number,
          u.profile_pic
        )
    );
  }
   async getSviAdminiFull(): Promise<User[]> {
    return await this.userRepository.getByRole("admin");
  }

  async getSviObicniKorisnici(): Promise<UserDto[]> {
    const obicniKorisnici: User[] = await this.userRepository.getByRole("user");
    return obicniKorisnici.map(
      (u) =>
        new UserDto(
          u.id,
          u.korisnickoIme,
          u.uloga,
          u.first_name,
          u.last_name,
          u.phone_number,
          u.profile_pic
        )
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
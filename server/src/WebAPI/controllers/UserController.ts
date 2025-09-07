 import type { Request, Response } from "express";
import { Router } from "express";
import multer from "multer";
import type { IUserService } from "../../Domain/services/users/IUserService.ts";
import { UserDto } from "../../Domain/DTOs/users/UserDto.ts";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware.ts";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware.ts";
import { User } from "../../Domain/models/User.ts";
import type { IFileStorageService } from "../../Domain/services/files/IFileStorageService.ts";

export class UserController {
  private router: Router;
  private userService: IUserService;
  private fileStorage: IFileStorageService;
  private upload = multer({ dest: "uploads/profile_pictures" });

  constructor(userService: IUserService, fileStorage: IFileStorageService) {
    this.router = Router();
    this.userService = userService;
    this.fileStorage = fileStorage;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/users",
      authenticate,
      authorize("admin"),
      this.korisnici.bind(this)
    );

    this.router.get(
      "/users/admins",
      authenticate,
      authorize("admin"),
      this.admini.bind(this)
    );

    this.router.get(
      "/users/users",
      authenticate,
      authorize("user"),
      this.obicniKorisnici.bind(this)
    );

    this.router.put(
      "/user/profile",
      authenticate,
      this.upload.single("profile_pic"),
      this.updateProfile.bind(this)
    );
  }

  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] =
        await this.userService.getSviKorisnici();
      res.status(200).json(korisniciPodaci);
    } catch (error) {
      res.status(500).json({ success: false, message: (error as any).message });
    }
  }
   private async admini(req: Request, res: Response): Promise<void> {
    try {
      const admini = await this.userService.getSviAdminiFull();
      res.status(200).json(admini);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      res.status(500).json({ success: false, message: (error as any).message });
    }
  }

  private async obicniKorisnici(req: Request, res: Response): Promise<void> {
    try {
      const obicni: UserDto[] = await this.userService.getSviObicniKorisnici();
      res.status(200).json(obicni);
    } catch (error) {
      res.status(500).json({ success: false, message: (error as any).message });
    }
  }
   private async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { first_name, last_name, phone_number } = req.body;
      const updateData: Partial<User> = {};

      if (first_name !== undefined) updateData.first_name = first_name;
      if (last_name !== undefined) updateData.last_name = last_name;
      if (phone_number !== undefined) updateData.phone_number = phone_number;

      if (req.file) {
        const savedPath = await this.fileStorage.saveFile(req.file);
        updateData.profile_pic = savedPath;
      }

      const updatedUser: UserDto = await this.userService.updateProfile(
        userId,
        updateData
      );

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Failed to update profile:", error);
      res.status(500).json({ success: false, message: (error as any).message });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
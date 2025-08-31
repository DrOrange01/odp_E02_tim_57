import type { Request, Response } from "express";
import { Router } from "express";
import type { IUserService } from "../../Domain/services/users/IUserService.ts";
import { UserDto } from "../../Domain/DTOs/users/UserDto.ts";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware.ts";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware.ts";
import { User } from "../../Domain/models/User.ts";

export class UserController {
  private router: Router;
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userService = userService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // ostale metode, npr. /api/v1/user/1 <--- user po ID-ju 1
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
      this.updateProfile.bind(this)
    );
  }

  /**
   * GET /api/v1/users
   * Svi korisnici
   */
  private async korisnici(req: Request, res: Response): Promise<void> {
    try {
      const korisniciPodaci: UserDto[] =
        await this.userService.getSviKorisnici();

      res.status(200).json(korisniciPodaci);
      return;
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async admini(req: Request, res: Response): Promise<void> {
    try {
      const admini = await this.userService.getSviAdminiFull(); // or getAllAdminsFull()
      console.log("admini fetched:", admini);
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
      res.status(500).json({ success: false, message: error });
    }
  }

  private async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const { first_name, last_name, phone_number, profile_pic } = req.body;

      const updateData: Partial<User> = {};
      if (first_name !== undefined) updateData.first_name = first_name;
      if (last_name !== undefined) updateData.last_name = last_name;
      if (phone_number !== undefined) updateData.phone_number = phone_number;
      if (profile_pic !== undefined) updateData.profile_pic = profile_pic;

      const updatedUser = await this.userService.updateProfile(
        userId,
        updateData
      );

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  /**
   * Getter za router
   */
  public getRouter(): Router {
    return this.router;
  }
}

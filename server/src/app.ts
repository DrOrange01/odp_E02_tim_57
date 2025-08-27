import express from "express";
import cors from "cors";
import type { IAuthService } from "./Domain/services/auth/IAuthService.ts";
import { AuthService } from "./services/auth/AuthService.ts";
import type { IUserRepository } from "./Domain/repositories/users/IUserRepository.ts";
import { UserRepository } from "./Database/repositories/users/UserRepository.ts";
import { AuthController } from "./WebAPI/controllers/AuthController.ts";
import type { IUserService } from "./Domain/services/users/IUserService.ts";
import { UserService } from "./services/users/UserService.ts";
import { UserController } from "./WebAPI/controllers/UserController.ts";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);

// Registering routes
app.use("/api/v1", authController.getRouter());
app.use("/api/v1", userController.getRouter());

export default app;

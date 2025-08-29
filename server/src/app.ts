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
import type { IMessageRepository } from "./Domain/repositories/messages/IMessageRepository.ts";
import { MessageRepository } from "./Database/repositories/messages/MessageRepository.ts";
import type { IMessageService } from "./Domain/services/messages/IMessageService.ts";
import { MessageService } from "./services/messages/MessageService.ts";
import { MessageController } from "./WebAPI/controllers/MessageController.ts";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const messageRepository: IMessageRepository = new MessageRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const messageService: IMessageService = new MessageService(messageRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const messageController = new MessageController(messageService);

// Registering routes
app.use("/api/v1", authController.getRouter());
app.use("/api/v1", userController.getRouter());
app.use("/api/v1", messageController.getRouter());

export default app;

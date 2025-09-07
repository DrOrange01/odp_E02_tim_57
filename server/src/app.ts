 
import path from "path";
import { fileURLToPath } from "url";
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
import { LocalFileStorageService } from "./Domain/services/files/LocalFileStorageService.ts";
import type { IMessageRepository } from "./Domain/repositories/messages/IMessageRepository.ts";
import { MessageRepository } from "./Database/repositories/messages/MessageRepository.ts";
import type { IMessageService } from "./Domain/services/messages/IMessageService.ts";
import { MessageService } from "./services/messages/MessageService.ts";
import { MessageController } from "./WebAPI/controllers/MessageController.ts";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  "/uploads/profile_pictures",
  express.static(path.join(__dirname, "../uploads/profile_pictures"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);
 // Repositories
const userRepository: IUserRepository = new UserRepository();
const messageRepository: IMessageRepository = new MessageRepository();
const fileStorageService = new LocalFileStorageService();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(
  userRepository,
  fileStorageService
);
const messageService: IMessageService = new MessageService(messageRepository);

// Controllers
const authController = new AuthController(authService);
const userController = new UserController(userService, fileStorageService);
const messageController = new MessageController(messageService);

// API routes
app.use("/api/v1", authController.getRouter());
app.use("/api/v1", userController.getRouter());
app.use("/api/v1", messageController.getRouter());

export default app;
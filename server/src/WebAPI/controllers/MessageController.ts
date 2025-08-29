import type { Request, Response } from "express";
import { Router } from "express";
import type { IMessageService } from "../../Domain/services/messages/IMessageService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class MessageController {
  private router: Router;
  private messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this.router = Router();
    this.messageService = messageService;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/messages",
      authenticate,
      authorize("admin", "user"),
      this.sendMessage.bind(this)
    );

    this.router.get(
      "/messages/conversations",
      authenticate,
      authorize("admin", "user"),
      this.getConversations.bind(this)
    );

    this.router.get(
      "/messages/conversations/:otherUserId",
      authenticate,
      authorize("admin", "user"),
      this.getConversationMessages.bind(this)
    );

    this.router.patch(
      "/messages/:messageId/read",
      authenticate,
      authorize("admin", "user"),
      this.markAsRead.bind(this)
    );
  }

  private async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const senderId = req.user!.id;
      const { receiverId, content } = req.body;

      if (!receiverId || !content) {
        res.status(400).json({ success: false, message: "Nedostaju podaci" });
        return;
      }

      const message = await this.messageService.sendMessage(
        senderId,
        receiverId,
        content
      );

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const conversations = await this.messageService.getUserConversations(
        userId
      );

      res.status(200).json({ success: true, data: conversations });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async getConversationMessages(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const otherUserId = parseInt(req.params.otherUserId, 10);

      if (isNaN(otherUserId)) {
        res
          .status(400)
          .json({ success: false, message: "Nevažeći ID korisnika" });
        return;
      }

      const messages = await this.messageService.getConversationMessages(
        userId,
        otherUserId
      );

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  private async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const messageId = parseInt(req.params.messageId, 10);

      if (isNaN(messageId)) {
        res.status(400).json({ success: false, message: "Nevažeći ID poruke" });
        return;
      }

      const success = await this.messageService.markMessageAsRead(
        userId,
        messageId
      );

      res.status(200).json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}

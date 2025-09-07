 import fs from "fs";
import path from "path";
import type { IFileStorageService } from "../../../Domain/services/files/IFileStorageService";

export class LocalFileStorageService implements IFileStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve("./uploads/profile_pictures");
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const targetPath = path.join(this.uploadDir, filename);

    await fs.promises.rename(file.path, targetPath);

    return `/uploads/profile_pictures/${filename}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const absolutePath = path.join("./", filePath);
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
    }
  }
} 
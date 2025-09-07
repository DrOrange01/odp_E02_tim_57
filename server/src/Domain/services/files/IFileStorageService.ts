import type { Express } from "express";
import type multer from "multer";

export interface IFileStorageService {
  saveFile(file: Express.Multer.File): Promise<string>;

  deleteFile(filePath: string): Promise<void>;
}
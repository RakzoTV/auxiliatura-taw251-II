import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import { extname, join } from "path";

export const UPLOADS_DIR = join(process.cwd(), "uploads");

export const imagenMulterOptions = {
    storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
            cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`)
        }
    }),
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
        if(!/^image\/(jpeg|png|jpg)$/.test(file.mimetype)){
            return cb(new BadRequestException("Solamente se permiten archivos de imagen (jpeg, png, jpg)"), false);
        }

        cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
};
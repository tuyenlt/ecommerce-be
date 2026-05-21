import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

export const MULTER_IMAGES_DESTINATION = "./uploads/images";

export const MulterImagesFilesInterceptor = FilesInterceptor("images", 10, {
  storage: diskStorage({
    destination: MULTER_IMAGES_DESTINATION,
    filename: (req, file, callback) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

      callback(null, `${uniqueName}${extname(file.originalname)}`);
    },
  }),

  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return callback(new Error("Only image files are allowed"), false);
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

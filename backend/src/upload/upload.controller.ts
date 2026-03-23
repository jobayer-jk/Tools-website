import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedMime = !!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|svg\+xml|svg|avif)$/i);
      const allowedExt = !!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i);
      if (!allowedMime && !allowedExt) {
        console.error('File rejected by filter:', file.mimetype, file.originalname);
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.error('File undefined in uploadFile handler');
      throw new BadRequestException('No file uploaded or invalid file format.');
    }
    // Return the URL path where the frontend can statically access the image
    return { url: `/uploads/${file.filename}` };
  }
}

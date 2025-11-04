import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // pasta local onde o arquivo sera salvo
      filename: (req, file, cb) => {
        // criia um nome unico para evitar sobrescrever arquivos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // retorna a URL pública do arquivo
    return { url: `http://localhost:3001/uploads/${file.filename}` };
  }
}

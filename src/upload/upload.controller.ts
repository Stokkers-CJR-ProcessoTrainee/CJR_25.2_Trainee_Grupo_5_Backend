import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('upload')
export class UploadController {
  @IsPublic()
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', //pasta local onde o arquivo serasalvo
      filename: (req, file, cb) => {
        //cria um nome unico pra n subscrever nenhum arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // retorna url publica
    return { url: `https://stokkers.onrender.com/uploads/${file.filename}` };
  }
}

import { Module } from '@nestjs/common';
import { ProductsImagesService } from './products-images.service';
import { ProductsImagesController } from './products-images.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ProductsImagesController],
  providers: [ProductsImagesService, PrismaService],
})
export class ProductsImagesModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ProductRatingsService } from './product_ratings.service';
import { ProductRatingsController } from './product_ratings.controller';

@Module({
    providers: [ProductRatingsService, PrismaService],
    controllers: [ProductRatingsController]
})
export class ProductsRatingsModule {}

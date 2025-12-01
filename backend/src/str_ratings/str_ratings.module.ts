import { Module } from '@nestjs/common';
import { StoreRatingsService } from './str_ratings.service';
import { PrismaService } from 'src/database/prisma.service';
import { StoreRatingsController } from './str_ratings.controller';

@Module({
    providers: [StoreRatingsService, PrismaService],
    controllers: [StoreRatingsController]
})
export class StoreRatingsModule {}
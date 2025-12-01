import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { StoresModule } from './stores/stores.module';
import { StoreRatingsModule } from './str_ratings/str_ratings.module';
import { ProductsRatingsModule } from './products_ratings/products_ratings.module';
import { ProductsModule } from './products/products.module';
import { ProductsImagesModule } from './products-images/products-images.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    StoresModule,
    StoreRatingsModule, 
    ProductsRatingsModule,
    ProductsModule,
    ProductsImagesModule,
    CommentsModule,
    CategoriesModule
  ],

  controllers: [AppController, UploadController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],

})
export class AppModule {}
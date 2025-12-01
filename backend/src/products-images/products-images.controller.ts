import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsImagesService } from './products-images.service';
import { CreateProductsImageDto } from './dto/create-products-image.dto';
import { UpdateProductsImageDto } from './dto/update-products-image.dto';
import { CurrentUser } from 'src/auth/decorators/curretn-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('products-images')
export class ProductsImagesController {
  constructor(private readonly productsImagesService: ProductsImagesService) {}

  @Post('product/:productId')
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: User,
    @Body() data: CreateProductsImageDto) {
    return this.productsImagesService.create(data, productId, user.id);
  }

  @IsPublic()
  @Get('product/:productId')
  findAll(
    @Param('productId', ParseIntPipe) productId: number) {
    return this.productsImagesService.findAll(productId);
  }

  @IsPublic()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number) {
    return this.productsImagesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: User,
    @Body() data: UpdateProductsImageDto) {
    return this.productsImagesService.update(id, data, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: User,
  ) {
    return this.productsImagesService.remove(id, user.id);
  }
}

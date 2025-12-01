import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ProductRatingsService } from './product_ratings.service';
import { CreateProductRatingsDto, UpdateProductRatingsDto } from './dto/products_ratings.dto';
import { CurrentUser } from 'src/auth/decorators/curretn-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('product-ratings')
export class ProductRatingsController {
    
        constructor (private readonly productRatingsService: ProductRatingsService) {}
    
        @Post('product/:productId')
        async create(
            @Param('productId', ParseIntPipe) productId: number,
            @Body() data: CreateProductRatingsDto,
            @CurrentUser() user: User
            ) {
            return this.productRatingsService.create(data, productId, user.id);
        }
    
        @IsPublic()
        @Get('product/:productId')
        async getAll(
            @Param('productId', ParseIntPipe) productId: number
        ) {
            return this.productRatingsService.getAll(productId);
        }
    
        @IsPublic()
        @Get(":id")
        async getUnique(
            @Param("id", ParseIntPipe) id: number) {
            return this.productRatingsService.getUnique(id)
        }
    
        @Patch(":id")
        async update(
            @Param("id", ParseIntPipe) id: number,
            @Body() data: UpdateProductRatingsDto,
            @CurrentUser() user: User,
        ) {
            return this.productRatingsService.update(id, data, user.id);
        }
    
        @Delete(":id")
        async delete(
            @Param("id", ParseIntPipe) id: number,
            @CurrentUser() user: User,
        ) {
            return this.productRatingsService.delete(id, user.id);
        }
        
    }


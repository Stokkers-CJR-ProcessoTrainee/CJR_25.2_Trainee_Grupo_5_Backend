import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Patch} from '@nestjs/common';
import { ProductsService } from './products.service';   
import { CreateProductsDto } from './dto/products.dto';   
import { CurrentUser } from 'src/auth/decorators/curretn-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { UpdateProductsDto } from './dto/update-products.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';


@Controller('products')
export class ProductsController {

    constructor (private readonly productsService: ProductsService) {}

    @Post('store/:storeId')
    create(
        @Param('storeId', ParseIntPipe) storeId: number,
        @CurrentUser() user: User,
        @Body() data: CreateProductsDto,
    )
        {
        return this.productsService.create(data, storeId, user.id);
    }

    @IsPublic()
    @Get('store/:storeId')
    findAllByStore(
        @Param('storeId', ParseIntPipe) storeId: number
    ){
        return this.productsService.findAllByStore(storeId);
    }

    @IsPublic()
    @Get('category/:categoryId')
    findAllByCategory(
        @Param('categoryId', ParseIntPipe) categoryId: number
    ){
        return this.productsService.findAllByCategory(categoryId);
    }
    
    @IsPublic()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() data: UpdateProductsDto,
        @CurrentUser() user: User
    ){
        return this.productsService.update(id, data, user.id);
    }

    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ){
        return this.productsService.delete(id, user.id);
    }  
}

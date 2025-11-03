import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @IsPublic()
    @Post()
    create(@Body() data: CreateCategoriesDto){
        return this.categoriesService.create(data);
    }

    @IsPublic()
    @Get()
    findAll(){
        return this.categoriesService.findAll();
    }   

    @IsPublic()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.categoriesService.findOne(id);
    }
    @Patch(':id')
    update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: UpdateCategoriesDto){
        return this.categoriesService.update(id, data);
    }   
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number){
        return this.categoriesService.delete(id);
    }


}

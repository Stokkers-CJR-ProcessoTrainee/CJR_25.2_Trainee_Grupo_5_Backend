import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto } from './stores.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/auth/decorators/curretn-user.decorator';
import { User } from 'src/user/entity/user.entity';


@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  async create(
    @Body() data: CreateStoreDto, 
    @CurrentUser() user: User
  ) {
    return this.storesService.create(data, user.id);
  }

  @IsPublic()
  @Get()
  async findAll() {
    return this.storesService.findAll();
  }

  @IsPublic()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storesService.findOne(Number(id));
  }
  
  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() data: UpdateStoreDto,
    @CurrentUser() user: User
  ) {
    return this.storesService.update(Number(id), data, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.storesService.remove(Number(id), user.id);
  }

  @IsPublic()
  @Get(':id/products')
  findProductsByStore(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.findProductsByStore(id);
  }

}

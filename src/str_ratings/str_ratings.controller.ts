import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Patch } from '@nestjs/common';
import { CreateStoreRatingsDto, UpdateStoreRatingsDto } from './dto/str_ratings.dto';
import { StoreRatingsService } from './str_ratings.service';
import { CurrentUser } from 'src/auth/decorators/curretn-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('store-ratings')
export class StoreRatingsController {

    constructor (private readonly storeRatingsService: StoreRatingsService) {}

    @Post('store/:storeId')
    async create(
        @Param('storeId', ParseIntPipe) storeId: number,
        @CurrentUser() user: User,
        @Body() data: CreateStoreRatingsDto,
    ) {
        return this.storeRatingsService.create(data, storeId, user.id);
    }

    @IsPublic()
    @Get('store/:storeId')
    async getAll(
        @Param('storeId', ParseIntPipe) storeId: number
    ) {
        return this.storeRatingsService.getAll(storeId);
    }

    @IsPublic()
    @Get(":id")
    async getUnique(@Param("id", ParseIntPipe) id: number) {
        return this.storeRatingsService.getUnique(id)
    }

    @Patch(":id")
    async update(
        @Param("id", ParseIntPipe) id: number, 
        @CurrentUser() user: User,
        @Body() data: UpdateStoreRatingsDto) {
        return this.storeRatingsService.update(id, data, user.id);
    }

    @Delete(":id")
    async delete(
        @Param("id", ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ) {
        return this.storeRatingsService.delete(id, user.id);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/auth/decorators/curretn-user.decorator';
import { User } from './entity/user.entity';
import { UpdatePassDto } from './dto/update-pasword.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic() 
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  getMyProfile(@CurrentUser() user: User){
    return this.userService.findOne(user.id);
  }

  @Patch('update')
  updateMyProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Patch('update-pass')
  updateMyPass(
    @CurrentUser() user: User,
    @Body() updatePassDto: UpdatePassDto) {
    const { currentPassword, newPassword } = updatePassDto;
    return this.userService.updatePass(user.id, currentPassword, newPassword);
  }

  @Delete('delete')
  remove(@CurrentUser() user: User) {
    return this.userService.remove(user.id);
  }

  @IsPublic()
  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @IsPublic()
  @Get(':id/stores')
  findStoresByUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findStoresByUser(id);
  }

  @IsPublic()
  @Get(':id/products')
  findProductsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findProductsByUser(id);
  }

}

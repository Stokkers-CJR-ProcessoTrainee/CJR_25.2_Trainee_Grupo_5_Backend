import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorators/is-public.decorator';
import { CurrentUser } from './auth/decorators/curretn-user.decorator';
import { User } from './user/entity/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  whoAmI(@CurrentUser() user: User) {
    return "Autenticação bem sucedida! Você está logado como: " + user.name;
  }

}

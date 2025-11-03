import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import * as AuthRequest from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) {} 

    @Post()
    @IsPublic()
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    login(@Request() req: AuthRequest.AuthRequest) {
        console.log(req.user);

        return this.authService.login(req.user);
    }

    @IsPublic()
    @Post('forgot')
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @IsPublic()
    @Post('verify')
    async validateCode(@Body() body: { email: string, code: string }) {
        return this.authService.verifyCode(body.email, body.code);
    }

    @IsPublic()
    @Post('reset')
    async resetPassword(@Body() body: { userId: number, newPassword: string }) {
        return this.authService.resetPassword(body.userId, body.newPassword);
    }

}

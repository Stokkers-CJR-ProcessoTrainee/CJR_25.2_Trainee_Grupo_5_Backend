import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginValidationMiddleware } from './middleware/login-validation.middleware';
import { PrismaService } from 'src/database/prisma.service';
import { MailService } from './auxiliar/mail.service';

@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService, MailService],
})
export class AuthModule {
  configure(consomer: MiddlewareConsumer) {
    consomer.apply(LoginValidationMiddleware).forRoutes({ path: 'login', method: RequestMethod.POST });
  }
}

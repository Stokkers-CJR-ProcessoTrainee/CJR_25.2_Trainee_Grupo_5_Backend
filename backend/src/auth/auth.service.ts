import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/UserPayload';
import { User } from 'src/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { PrismaService } from 'src/database/prisma.service';
import { MailService } from './auxiliar/mail.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService,
                private readonly prisma: PrismaService,
                private readonly mailService: MailService
    ) {}

    login(user: User):UserToken {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
        };

        const jwttoken = this.jwtService.sign(payload);

        return {
            token: jwttoken
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findbyEmail(email);

        if (user) {
            const senhaValida = await bcrypt.compare(password, user.password_hash);
            if (senhaValida) {  
                return {
                    ...user,
                    password_hash: undefined,
                };
            }
        }

        throw new Error('Credenciais inválidas');

    }

    async forgotPassword(email: string) {
        const user = await this.userService.findbyEmail(email);
        if (!user) {
            throw new BadRequestException('Usuário não encontrado');
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); 
        await this.prisma.passwordReset.create({
            data:{
                userId: user.id,
                code,
                expiresAt
            }
        });
        await this.mailService.sendResetCode(user.email, code);
        return {message: 'Código para recuperação de senha enviadas para o seu email!'}
    }

    async verifyCode(email: string, code: string) {
        const user = await this.userService.findbyEmail(email);
        if (!user) {
            throw new BadRequestException('Usuário não encontrado');
        }

        const record = await this.prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                code,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!record) {
            throw new BadRequestException('Código inválido');
        }

        if (record.expiresAt < new Date()) {
            throw new BadRequestException('Código expirado');
        }

        return {message: 'Código validado com sucesso!', userId: user.id};
    }

    async resetPassword(userId: number ,newPassword: string) {
        await this.userService.update(userId, { password_hash: newPassword });
        await this.prisma.passwordReset.deleteMany({where: {userId}});
        return {message: 'Senha alterada com sucesso!'};
    }
}

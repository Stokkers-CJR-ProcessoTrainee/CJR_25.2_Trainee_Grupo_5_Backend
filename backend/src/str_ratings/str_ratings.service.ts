import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreRatingsDto, UpdateStoreRatingsDto } from './dto/str_ratings.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StoreRatingsService {

    constructor (private prisma: PrismaService) {}

    async create (
        data: CreateStoreRatingsDto,
        storeId: number,
        userId: number) {

        const store = await this.prisma.stores.findUnique({
            where: {
                id: storeId
            }
        });
        if (!store) throw new NotFoundException('Loja não encontrada');

        const existe = await this.prisma.storeRatings.findFirst({
            where: {
                user_id: userId,
                store_id: storeId,
            }
        });
        if (existe) throw new ConflictException('Usuário já avaliou esta loja');

        const rating = await this.prisma.storeRatings.create({
            data: {
                ...data,
                store_id: storeId,
                user_id: userId,
            }
        });
        return rating;
    }

    async getAll(storeId: number) {
        return await this.prisma.storeRatings.findMany({
            where: { store_id: storeId },
            include: { user: { select: { username: true, profile_picture_url: true }}}
        });
    }

    async getUnique(id: number) {
        const ratingExists = await this.prisma.storeRatings.findUnique ({
            where: { id },
            include: { 
                user: {
                    select: { username: true, profile_picture_url: true }
                },
                store: {
                    select: { user_id: true}
                }
            }
        });
        if (!ratingExists) {
            throw new NotFoundException("Avaliação não encontrada");
        }
        return ratingExists;
    }

    async update(id: number, data: UpdateStoreRatingsDto, userId: number) {
        const ratingExists = await this.prisma.storeRatings.findUnique ({
            where: { id },
        });
        if (!ratingExists) {
            throw new NotFoundException("Avaliação não encontrada");
        }
        if (ratingExists.user_id !== userId) {
            throw new NotFoundException(
                "Você não pode editar esta avaliação"
            );
        }
        return await this.prisma.storeRatings.update({
            data,
            where: { id },
        });
    }

    async delete(id: number, userId: number) {
        const ratingExists = await this.prisma.storeRatings.findUnique ({
            where: { id },
        });
        if (!ratingExists) {
            throw new NotFoundException("Avaliação não encontrada");
        }
        if(ratingExists.user_id !== userId) {
            throw new NotFoundException(
                "Você não pode deletar esta avaliação"
            );
        }
        return await this.prisma.storeRatings.delete({ where: { id } });
    }

}
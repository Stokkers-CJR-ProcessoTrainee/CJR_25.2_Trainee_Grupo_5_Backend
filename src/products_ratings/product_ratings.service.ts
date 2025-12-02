import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProductRatingsDto, UpdateProductRatingsDto } from './dto/products_ratings.dto';

@Injectable()
export class ProductRatingsService {

        constructor (private prisma: PrismaService) {}
    
        async create (
            data: CreateProductRatingsDto,
            productId: number,
            userId: number) {
            const product = await this.prisma.products.findUnique({
                where: {id: productId}
            });
            if (!product) {
                throw new NotFoundException('Produto não encontrado')
            }

            const existe = await this.prisma.productRatings.findFirst({
                where: {
                    user_id: userId,
                    product_id: productId,
                },
            });
            if (existe) {
                throw new ConflictException('Você já avaliou este produto')
            }

            return this.prisma.productRatings.create({
                data: {
                    ...data,
                    user_id: userId,
                    product_id: productId,
                },
            });
        }
    
        async getAll(productId: number) {
            const product = await this.prisma.products.findUnique({
                where: { id: productId }
            })
            if (!product) {
                throw new NotFoundException('Produto não encontrado')
            }
            return await this.prisma.productRatings.findMany({
                where: { product_id: productId },
            });
        }
    
        async getUnique(id: number) {
            const rating = await this.prisma.productRatings.findUnique ({
                where: { id: id }, 
                include: {
                    product: true,
                },
            });
            if (!rating) {
                throw new NotFoundException("Avaliação não encontrada");
            }
            return rating;
        }       
    
        async update(ratingId: number, data: UpdateProductRatingsDto, userId: number) {
            const rating = await this.prisma.productRatings.findUnique ({
                where: { id: ratingId }
            });

            if (!rating) {
                throw new NotFoundException("Avaliação não encontrada");
            }

            if (rating.user_id !== userId) {
                throw new ForbiddenException("Você não tem permissão para editar essa avaliação");
            }

            return await this.prisma.productRatings.update({
                where: {id: ratingId},
                data: data,
            });
        }
    
        async delete(ratingId: number, userId: number) {
            const rating = await this.prisma.productRatings.findUnique ({
                where: { id: ratingId }
            });
            if (!rating) {
                throw new NotFoundException('Avaliação não encontrada')
            }

            if(rating.user_id !== userId) {
                throw new ForbiddenException('Você não tem permissão para deletar essa avaliação')
            }

            return await this.prisma.productRatings.delete({
                where: { id: ratingId },
            })   
        }
    }
    

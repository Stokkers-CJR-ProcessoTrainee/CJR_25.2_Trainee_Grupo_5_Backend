import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentDto } from './comment.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CommentsService {

  constructor(private prisma: PrismaService) { }

  async createStoreRatingComment(data: CommentDto, StoreRatingId: number, UserId: number) {
    const StoreRating = await this.prisma.storeRatings.findUnique({
      where: { id: StoreRatingId }
    })

    if (!StoreRating) {
      throw new NotFoundException("Avaliação não encontrada")
    }

    return this.prisma.ratingComments.create({
      data: {
        ...data,
        user_id: UserId,
        store_rating_id: StoreRatingId,
      },
    })
  }

  async createProductRatingComment(data: CommentDto, ProductRatingId: number, UserId: number) {
    const ProductRating = await this.prisma.productRatings.findUnique({
      where: { id: ProductRatingId }
    })

    if (!ProductRating) {
      throw new NotFoundException("Avaliacao não encontrada")
    }

    return this.prisma.ratingComments.create({
      data: {
        ...data,
        user_id: UserId,
        product_rating_id: ProductRatingId,
      },
    })
  }

  async findAllStoreRating(ratingId: number) {
    const rating = await this.prisma.storeRatings.findUnique({
      where: { id: ratingId }
    })
    if (!rating) {
      throw new NotFoundException("Avaliação não encontrada")
    }
    return this.prisma.ratingComments.findMany({
      where: { store_rating_id: ratingId },
      include: { user: { select : { username: true, profile_picture_url: true } } },
    });
  }

  async findAllProductRating(ratingId: number) {
    const rating = await this.prisma.productRatings.findUnique({
      where: { id: ratingId }
    })
    if (!rating) {
      throw new NotFoundException("Avaliação não encontrada")
    }
    return this.prisma.ratingComments.findMany({
      where: { product_rating_id: ratingId },
      include: { user: { select : { username: true, profile_picture_url: true } } },
    });
  }

  async update(id: number, data: CommentDto, userId: number) {
    const commentexists = await this.prisma.ratingComments.findUnique({
      where: { id }
    })
    if (!commentexists) {
      throw new NotFoundException("Comentário não encontrado")
    }

    if (commentexists.user_id !== userId) {
      throw new ForbiddenException("Você não tem permissão para editar esse comentário")
    }
    return await this.prisma.ratingComments.update({
      data: data,
      where: { id }
    })
  }

  async delete(id: number, userId: number) {
    const commentexists = await this.prisma.ratingComments.findUnique({
      where: { id }
    })
    if (!commentexists) {
      throw new NotFoundException("Comentário não encontrado")
    }
    
    if (commentexists.user_id !== userId) {
      throw new ForbiddenException("Você não tem permissao para deletar esse comentário")
    }
    return await this.prisma.ratingComments.delete({
      where: { id },
    });
  }
}

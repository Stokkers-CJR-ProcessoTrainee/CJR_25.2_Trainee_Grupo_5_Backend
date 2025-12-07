import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsDto } from './dto/products.dto';
import { PrismaService } from '../database/prisma.service';
import { UpdateProductsDto } from './dto/update-products.dto';


@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) { }

  async create(
    data: CreateProductsDto,
    storeId: number,
    userId: number) {

    const store = await this.prisma.stores.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      throw new NotFoundException("Loja não encontrada");
    }

    if (store.user_id !== userId) {
      throw new ForbiddenException("Você não tem permissão para adicionar produtos nesta loja");
    }

    const products = await this.prisma.products.create({
      data: {
        ...data,
        store_id: storeId,
      }
    })
    return products;

  }

  async findAllByStore(storeId: number) {
    const store = await this.prisma.stores.findUnique({
      where: { id: storeId }
    })

    if (!store) {
      throw new NotFoundException("Loja não encontrada")
    }

    return this.prisma.products.findMany({
      where: {
        store_id: storeId,
      },
      include: {
        store: true,
        product_images: true,
        product_ratings: { select: { rating: true } }
      }
    });
  }

  async findAllByCategory(categoryId: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const categoryIds = await this.prisma.$queryRaw<[{ id: number }]>`
      WITH RECURSIVE "DescendantCategories" AS (
        SELECT "id"
        FROM "Categories"
        WHERE "id" = ${categoryId}
        
        UNION ALL
        
        SELECT c."id"
        FROM "Categories" c
        JOIN "DescendantCategories" dc ON c."parent_category_id" = dc."id"
      )
      SELECT "id" FROM "DescendantCategories";
    `;

    const allCategoryIds = categoryIds.map((c) => c.id);

    return this.prisma.products.findMany({
      where: {
        category_id: {
          in: allCategoryIds,
        },
      },
      include: { store: true, product_images: true, category: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.products.findFirst({
      where: { id: id },
      include: {
        store: {
          select: { category_id: true, sticker_url: true, user_id: true }
        },
        category: {
          select: { name: true }
        },
        product_images: {
          select: {
            id: true,
            order: true,
            image_url: true
          }
        },
        product_ratings: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user: {
              select: {
                username: true,
                profile_picture_url: true
              }
            }
          }
        }
      }
    });
  }

  async update(productId: number, data: UpdateProductsDto, userId) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        store: true,
      }
    });

    if (!product) {
      throw new NotFoundException("Produto não encontrado")
    }

    if (product.store.user_id !== userId) {
      throw new ForbiddenException("Você não tem permissão para editar este produto")
    }

    return await this.prisma.products.update({
      where: { id: productId },
      data: data,
    });
  }

  async delete(productId: number, userId: number) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        store: true
      }
    })
    if (!product) {
      throw new NotFoundException('Produto não encontrado')
    }

    if (product.store.user_id !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover esse produto')
    }
    return await this.prisma.products.delete({
      where: { id: productId }
    });
  }
}

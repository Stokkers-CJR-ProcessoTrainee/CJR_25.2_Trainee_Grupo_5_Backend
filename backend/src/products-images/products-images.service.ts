import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsImageDto } from './dto/create-products-image.dto';
import { UpdateProductsImageDto } from './dto/update-products-image.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductsImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductsImageDto, productId: number, userId: number ) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        store: true,
      }
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado')
    }

    if (product.store.user_id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para adicionar imagens a este produto'
      );
    }

    return this.prisma.productImages.create({
      data: {
        ...data,
        product_id: productId,
      },
    });
  }

  async findAll(productId: number) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId }
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.productImages.findMany({
      where: { product_id: productId },
      orderBy: { order: 'asc' },
    })
  }

  async findOne(ProductImageId: number) {
    const ImagemProduto = await this.prisma.productImages.findUnique({
      where: {id: ProductImageId}
    })
    if (!ImagemProduto) {
      throw new NotFoundException("Imagem não encontrada");
    }
    return ImagemProduto;
  }

  async update(ProductImageId: number, data: UpdateProductsImageDto, userId: number) {
    const ImagemProduto = await this.prisma.productImages.findUnique({
      where: { id: ProductImageId },
      include: {
        product: { include: { store: true } }
      }
    })
    if (!ImagemProduto) {
      throw new NotFoundException("Imagem não encontrada")
    }

    if (ImagemProduto.product.store.user_id !== userId) {
      throw new ForbiddenException("Você não tem permissão para editar esta imagem")
    }

    return this.prisma.productImages.update({
      where: { id: ProductImageId },
      data,
    })
  }

  async remove(ProductImageId: number, userId: number) {
    const ImagemProduto = await this.prisma.productImages.findUnique({
      where: { id: ProductImageId },
      include: {
        product: { include: { store: true } }
      }
    })
    if (!ImagemProduto) {
      throw new NotFoundException('Imagem não encontrada')
    }
    if (ImagemProduto.product.store.user_id !== userId){
      throw new ForbiddenException("Você não tem permissão para deletar esta imagem")
    }
    return this.prisma.productImages.delete({
      where: { id: ProductImageId }
    })
  }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStoreDto, UpdateStoreDto } from './stores.dto';

@Injectable()
export class StoresService {

  constructor (private prisma: PrismaService) {}
  
  async create(data: CreateStoreDto, userId: number) {
  const stores = await this.prisma.stores.create ({
    data: {
      ...data,
      user_id: userId,
      sticker_url: data.sticker_url ?? "/foto-loja.svg",
      banner_url: data.banner_url ?? "/banner-loja.svg"
    },
  });
  return stores;
}

  async findAll() {
    return this.prisma.stores.findMany();
  }

  async findOne(id: number) {
    const storeExists = await this.prisma.stores.findUnique({ 
    where: {id},
    include: {
      owner: {
        select: {
          name: true
        }
      }
    }
  })
  if(!storeExists){
    throw new NotFoundException("Loja não encontrada")
  }
    return storeExists;
  }

  async update(id: number, data: UpdateStoreDto, userId: number) {
    const storeExists = await this.prisma.stores.findUnique({ 
    where: {id} 
  })
  if(!storeExists){
    throw new NotFoundException("Loja não encontrada")
  }
  if (storeExists.user_id !== userId){
    throw new ForbiddenException(
      'Voce não tem permissão para editar esta loja'
    );
  }
  return this.prisma.stores.update({
      where: {id},
      data,
    });
  }

  async remove(id: number, userId: number) {
    const storeExists = await this.prisma.stores.findUnique({ 
    where: {id} 
  })
  if(!storeExists){
    throw new NotFoundException("Loja não encontrada")
  }
  if(storeExists.user_id !== userId){
    throw new ForbiddenException(
      'Você não tem permissão para deletar essa loja'
    );
  }
    return this.prisma.stores.delete({ where: { id } });
  }

  async findProductsByStore(storeId: number) {
  return this.prisma.products.findMany({
    where: { store_id: storeId },
    include: {
      product_images: true, 
      category: true,       
    },
  });
}
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {

  constructor(private prisma: PrismaService) { }

  async create(data: CreateCategoriesDto) {
    if (data.parent_category_id) {
      const parentCategory = await this.prisma.categories.findUnique({
        where: { id: data.parent_category_id },
      });
      if (!parentCategory) {
        throw new NotFoundException("Categoria 'pai' não encontrada")
      }
    }

    return this.prisma.categories.create({
      data: data,
    });
  }

  async findAll() {
    return this.prisma.categories.findMany();
  }

  async findAllParents() {
    return this.prisma.categories.findMany({
      where: { parent_category_id: null }
    })
  }

  async update(id: number, data: UpdateCategoriesDto) {
    const categoryexists = await this.prisma.categories.findUnique({
      where: { id }
    });
    if (!categoryexists) {
      throw new NotFoundException("Categoria não encontrada")
    }
    return await this.prisma.categories.update({
      data,
      where: { id }
    });
  }

  async delete(id: number) {
    const categoryexists = await this.prisma.categories.findUnique({
      where: { id }
    });
    if (!categoryexists) {
      throw new NotFoundException("Categoria não encontrada")
    }
    return await this.prisma.categories.delete({
      where: { id }
    });
  }

  async findOne(id: number) {
    const categoryexists = await this.prisma.categories.findUnique({
      where: { id }
    });
    if (!categoryexists) {
      throw new NotFoundException("Categoria não encontrada")
    }
    return categoryexists;
  }

}

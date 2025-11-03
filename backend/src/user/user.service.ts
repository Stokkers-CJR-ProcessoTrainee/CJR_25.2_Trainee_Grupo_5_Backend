import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password_hash: await bcrypt.hash(createUserDto.password_hash, 10),
    } 

    const new_user = await this.prisma.users.create({
      data,
    });

    return {
      ...new_user,
      password_hash: undefined,
    };
  }

  async findbyEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async findAll() {
    const users = await this.prisma.users.findMany(); 

    const userWithoutPassword = users.map(user => {

      return {
        ...user,
        password_hash: undefined,
      };
    });
    
    return userWithoutPassword
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: id }
    })

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return {
      ...user,
      password_hash: undefined,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id)

    const dataToUpdate = {
      ...updateUserDto 
    };

    if (updateUserDto.password_hash){
      dataToUpdate.password_hash = await bcrypt.hash(updateUserDto.password_hash, 10)
    };

    const updatedUser = await this.prisma.users.update({
      where: { id: id },
      data: dataToUpdate,
    });

    return {
      ...updatedUser,
      password_hash: undefined,
    };
  }

  async remove(id: number) {
    const userToDelete = await this.findOne(id);
    await this.prisma.users.delete({
      where: { id: id },
    });
    return userToDelete
  }

  async findStoresByUser(userId: number) {
    return this.prisma.stores.findMany({
      where: { user_id: userId },
      include: {
        products: true,
      },
    });
  }

  async findProductsByUser(userId: number) {
    return this.prisma.products.findMany({
      where: {
        store: {
          user_id: userId,
        },
      },
      include: {
        product_images: true,
        store: true,
      },
    });
  }

  async findRatingsByUser(userId: number) {
  const user = await this.prisma.users.findUnique({
    where: { id: userId },
    include: {
      store_ratings: {
        include: { store: true },
      },
      product_ratings: {
        include: { product: true },
      },
    },
  });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado');
  }

  return {
    store_ratings: user.store_ratings,
    product_ratings: user.product_ratings,
    };
  }

}
  
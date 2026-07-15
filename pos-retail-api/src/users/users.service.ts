import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

const SALT = 10;
const EXCLUDE_PASS = { password: false, id: true, username: true, nama: true, role: true, status: true, createdAt: true };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.pengguna.findMany({ select: EXCLUDE_PASS, orderBy: { nama: 'asc' } });
  }

  async findOne(id: number) {
    const user = await this.prisma.pengguna.findUnique({ where: { id }, select: EXCLUDE_PASS });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.pengguna.findUnique({ where: { username: dto.username } });
    if (exists) throw new ConflictException('Username sudah digunakan');

    const hashed = await bcrypt.hash(dto.password, SALT);
    return this.prisma.pengguna.create({
      data: { ...dto, password: hashed },
      select: EXCLUDE_PASS,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, SALT);
    return this.prisma.pengguna.update({ where: { id }, data, select: EXCLUDE_PASS });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pengguna.delete({ where: { id }, select: EXCLUDE_PASS });
  }
}

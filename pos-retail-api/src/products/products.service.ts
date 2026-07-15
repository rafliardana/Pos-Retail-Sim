import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.barang.findMany({
      where: search
        ? { nama: { contains: search, mode: 'insensitive' } }
        : undefined,
      orderBy: { nama: 'asc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.barang.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Produk tidak ditemukan');
    return item;
  }

  create(dto: CreateProductDto) {
    return this.prisma.barang.create({ data: dto });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.barang.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.barang.delete({ where: { id } });
  }

  getLowStock() {
    // ponytail: raw query karena Prisma v5 tidak support cross-field comparison
    return this.prisma.$queryRaw`SELECT * FROM barang WHERE stok <= "minStok" ORDER BY nama`;
  }
}

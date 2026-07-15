import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMutationDto } from './dto/mutation.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createMutation(dto: CreateMutationDto, userId: number) {
    const barang = await this.prisma.barang.findUnique({ where: { id: dto.barangId } });
    if (!barang) throw new NotFoundException('Barang tidak ditemukan');

    if (dto.tipe === 'keluar' && barang.stok < dto.jumlah) {
      throw new BadRequestException(`Stok tidak cukup (tersedia: ${barang.stok})`);
    }

    return this.prisma.$transaction(async (tx) => {
      const mutasi = await tx.mutasiStok.create({
        data: {
          barangId: dto.barangId,
          penggunaId: userId,
          tipe: dto.tipe,
          jumlah: dto.jumlah,
          keterangan: dto.keterangan,
        },
        include: { barang: { select: { nama: true } } },
      });

      await tx.barang.update({
        where: { id: dto.barangId },
        data: {
          stok: dto.tipe === 'masuk'
            ? { increment: dto.jumlah }
            : { decrement: dto.jumlah },
        },
      });

      return mutasi;
    });
  }

  getMutations(barangId?: number) {
    return this.prisma.mutasiStok.findMany({
      where: barangId ? { barangId } : undefined,
      include: {
        barang: { select: { nama: true } },
        pengguna: { select: { nama: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  getLowStock() {
    // ponytail: raw SQL karena Prisma belum support cross-field comparison secara native
    return this.prisma.$queryRaw`
      SELECT * FROM barang WHERE stok <= "minStok" ORDER BY nama
    `;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSalesReport(from?: string, to?: string) {
    const where: any = { status: 'selesai' };
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [transaksi, aggregate] = await Promise.all([
      this.prisma.transaksi.findMany({
        where,
        include: {
          pengguna: { select: { nama: true } },
          detail: { include: { barang: { select: { nama: true, kategori: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaksi.aggregate({
        where,
        _sum: { grandTotal: true, ppn: true, totalHarga: true },
        _count: { id: true },
      }),
    ]);

    return {
      summary: {
        totalTransaksi: aggregate._count.id,
        totalPendapatan: aggregate._sum.grandTotal ?? 0,
        totalPPN: aggregate._sum.ppn ?? 0,
        totalHargaPokok: aggregate._sum.totalHarga ?? 0,
      },
      transaksi,
    };
  }

  async getStockReport() {
    const [barang, mutasi] = await Promise.all([
      this.prisma.barang.findMany({ orderBy: { stok: 'asc' } }),
      this.prisma.mutasiStok.groupBy({
        by: ['barangId', 'tipe'],
        _sum: { jumlah: true },
      }),
    ]);

    return { barang, mutasi };
  }
}

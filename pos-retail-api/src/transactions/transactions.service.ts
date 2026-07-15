import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transaction.dto';

const PPN_RATE = 0.1;

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, kasirId: number) {
    // Ambil data barang semua sekaligus (1 query)
    const ids = dto.items.map((i) => i.barangId);
    const barangList = await this.prisma.barang.findMany({
      where: { id: { in: ids } },
    });

    // Validasi stok dan hitung total
    let totalHarga = 0;
    const detailData: {
      barangId: number;
      jumlah: number;
      hargaSatuan: number;
      subtotal: number;
    }[] = [];

    for (const item of dto.items) {
      const barang = barangList.find((b) => b.id === item.barangId);
      if (!barang) throw new NotFoundException(`Barang ID ${item.barangId} tidak ditemukan`);
      if (barang.stok < item.jumlah)
        throw new BadRequestException(`Stok ${barang.nama} tidak cukup (tersedia: ${barang.stok})`);

      const subtotal = barang.harga * item.jumlah;
      totalHarga += subtotal;
      detailData.push({ barangId: item.barangId, jumlah: item.jumlah, hargaSatuan: barang.harga, subtotal });
    }

    const ppn = Math.round(totalHarga * PPN_RATE);
    const grandTotal = totalHarga + ppn;
    const kode = `TRX${Date.now()}`;

    // Jalankan dalam satu transaksi DB — atomic
    return this.prisma.$transaction(async (tx) => {
      const trx = await tx.transaksi.create({
        data: {
          kode,
          penggunaId: kasirId,
          totalHarga,
          ppn,
          grandTotal,
          status: 'pending',
          detail: { create: detailData },
        },
        include: { detail: { include: { barang: true } }, pengguna: { select: { nama: true } } },
      });

      // Kurangi stok semua barang sekaligus
      await Promise.all(
        dto.items.map((item) =>
          tx.barang.update({
            where: { id: item.barangId },
            data: { stok: { decrement: item.jumlah } },
          }),
        ),
      );

      return trx;
    });
  }

  findAll() {
    return this.prisma.transaksi.findMany({
      include: {
        pengguna: { select: { nama: true, role: true } },
        detail: { include: { barang: { select: { nama: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const trx = await this.prisma.transaksi.findUnique({
      where: { id },
      include: {
        pengguna: { select: { nama: true, role: true } },
        detail: { include: { barang: true } },
      },
    });
    if (!trx) throw new NotFoundException('Transaksi tidak ditemukan');
    return trx;
  }

  async verify(id: number) {
    await this.findOne(id);
    return this.prisma.transaksi.update({
      where: { id },
      data: { status: 'selesai' },
    });
  }
}

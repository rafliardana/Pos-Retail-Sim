"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PPN_RATE = 0.1;
let TransactionsService = class TransactionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, kasirId) {
        const ids = dto.items.map((i) => i.barangId);
        const barangList = await this.prisma.barang.findMany({
            where: { id: { in: ids } },
        });
        let totalHarga = 0;
        const detailData = [];
        for (const item of dto.items) {
            const barang = barangList.find((b) => b.id === item.barangId);
            if (!barang)
                throw new common_1.NotFoundException(`Barang ID ${item.barangId} tidak ditemukan`);
            if (barang.stok < item.jumlah)
                throw new common_1.BadRequestException(`Stok ${barang.nama} tidak cukup (tersedia: ${barang.stok})`);
            const subtotal = barang.harga * item.jumlah;
            totalHarga += subtotal;
            detailData.push({ barangId: item.barangId, jumlah: item.jumlah, hargaSatuan: barang.harga, subtotal });
        }
        const ppn = Math.round(totalHarga * PPN_RATE);
        const grandTotal = totalHarga + ppn;
        const kode = `TRX${Date.now()}`;
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
            await Promise.all(dto.items.map((item) => tx.barang.update({
                where: { id: item.barangId },
                data: { stok: { decrement: item.jumlah } },
            })));
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
    async findOne(id) {
        const trx = await this.prisma.transaksi.findUnique({
            where: { id },
            include: {
                pengguna: { select: { nama: true, role: true } },
                detail: { include: { barang: true } },
            },
        });
        if (!trx)
            throw new common_1.NotFoundException('Transaksi tidak ditemukan');
        return trx;
    }
    async verify(id) {
        await this.findOne(id);
        return this.prisma.transaksi.update({
            where: { id },
            data: { status: 'selesai' },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map
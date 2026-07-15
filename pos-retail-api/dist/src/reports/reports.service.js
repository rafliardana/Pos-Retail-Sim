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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesReport(from, to) {
        const where = { status: 'selesai' };
        if (from || to) {
            where.createdAt = {};
            if (from)
                where.createdAt.gte = new Date(from);
            if (to)
                where.createdAt.lte = new Date(to);
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMutation(dto, userId) {
        const barang = await this.prisma.barang.findUnique({ where: { id: dto.barangId } });
        if (!barang)
            throw new common_1.NotFoundException('Barang tidak ditemukan');
        if (dto.tipe === 'keluar' && barang.stok < dto.jumlah) {
            throw new common_1.BadRequestException(`Stok tidak cukup (tersedia: ${barang.stok})`);
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
    getMutations(barangId) {
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
        return this.prisma.$queryRaw `
      SELECT * FROM barang WHERE stok <= "minStok" ORDER BY nama
    `;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map
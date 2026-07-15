"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding data...');
    const users = [
        { username: 'devi', password: 'password', nama: 'Devi', role: 'kasir' },
        { username: 'rafli', password: 'password', nama: 'Rafli', role: 'gudang' },
        { username: 'okta', password: 'password', nama: 'Okta', role: 'admin' },
        { username: 'alif', password: 'password', nama: 'Alif', role: 'owner' },
    ];
    for (const u of users) {
        await prisma.pengguna.upsert({
            where: { username: u.username },
            update: {},
            create: { ...u, password: await bcrypt.hash(u.password, 10) },
        });
    }
    const products = [
        { nama: 'Indomie Goreng', harga: 3500, stok: 150, minStok: 20, kategori: 'Makanan', barcode: '1234567890' },
        { nama: 'Teh Botol Sosro', harga: 5000, stok: 200, minStok: 30, kategori: 'Minuman', barcode: '2345678901' },
        { nama: 'Sabun Lifebuoy', harga: 8000, stok: 80, minStok: 10, kategori: 'Kebersihan', barcode: '3456789012' },
        { nama: 'Beras 5kg', harga: 45000, stok: 40, minStok: 5, kategori: 'Sembako', barcode: '4567890123' },
        { nama: 'Minyak Goreng 1L', harga: 18000, stok: 90, minStok: 15, kategori: 'Sembako', barcode: '5678901234' },
        { nama: 'Gula 1kg', harga: 12000, stok: 120, minStok: 20, kategori: 'Sembako', barcode: '6789012345' },
        { nama: 'Roti Tawar', harga: 15000, stok: 30, minStok: 10, kategori: 'Makanan', barcode: '7890123456' },
        { nama: 'Susu UHT', harga: 8000, stok: 100, minStok: 20, kategori: 'Minuman', barcode: '8901234567' },
        { nama: 'Detergen Rinso', harga: 25000, stok: 50, minStok: 10, kategori: 'Kebersihan', barcode: '9012345678' },
        { nama: 'Shampoo Sunsilk', harga: 15000, stok: 60, minStok: 10, kategori: 'Kebersihan', barcode: '0123456789' },
    ];
    for (const p of products) {
        await prisma.barang.upsert({
            where: { barcode: p.barcode },
            update: {},
            create: p,
        });
    }
    console.log('✅ Seeding selesai!');
    console.log('\nAkun demo yang tersedia:');
    console.log('  kasir  → devi  / password');
    console.log('  gudang → rafli / password');
    console.log('  admin  → okta  / password');
    console.log('  owner  → alif  / password\n');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map
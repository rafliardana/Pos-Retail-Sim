import { CreateTransactionDto } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(dto: CreateTransactionDto, req: any): Promise<{
        pengguna: {
            nama: string;
        };
        detail: ({
            barang: {
                id: number;
                nama: string;
                createdAt: Date;
                barcode: string | null;
                harga: number;
                stok: number;
                minStok: number;
                kategori: string;
                gambar: string | null;
                updatedAt: Date;
            };
        } & {
            id: number;
            barangId: number;
            jumlah: number;
            transaksiId: number;
            hargaSatuan: number;
            subtotal: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusTransaksi;
        createdAt: Date;
        penggunaId: number;
        kode: string;
        totalHarga: number;
        ppn: number;
        grandTotal: number;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        pengguna: {
            nama: string;
            role: import(".prisma/client").$Enums.Role;
        };
        detail: ({
            barang: {
                nama: string;
            };
        } & {
            id: number;
            barangId: number;
            jumlah: number;
            transaksiId: number;
            hargaSatuan: number;
            subtotal: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusTransaksi;
        createdAt: Date;
        penggunaId: number;
        kode: string;
        totalHarga: number;
        ppn: number;
        grandTotal: number;
    })[]>;
    findOne(id: number): Promise<{
        pengguna: {
            nama: string;
            role: import(".prisma/client").$Enums.Role;
        };
        detail: ({
            barang: {
                id: number;
                nama: string;
                createdAt: Date;
                barcode: string | null;
                harga: number;
                stok: number;
                minStok: number;
                kategori: string;
                gambar: string | null;
                updatedAt: Date;
            };
        } & {
            id: number;
            barangId: number;
            jumlah: number;
            transaksiId: number;
            hargaSatuan: number;
            subtotal: number;
        })[];
    } & {
        id: number;
        status: import(".prisma/client").$Enums.StatusTransaksi;
        createdAt: Date;
        penggunaId: number;
        kode: string;
        totalHarga: number;
        ppn: number;
        grandTotal: number;
    }>;
    verify(id: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusTransaksi;
        createdAt: Date;
        penggunaId: number;
        kode: string;
        totalHarga: number;
        ppn: number;
        grandTotal: number;
    }>;
}

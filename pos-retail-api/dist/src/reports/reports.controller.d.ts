import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getSales(from?: string, to?: string): Promise<{
        summary: {
            totalTransaksi: number;
            totalPendapatan: number;
            totalPPN: number;
            totalHargaPokok: number;
        };
        transaksi: ({
            pengguna: {
                nama: string;
            };
            detail: ({
                barang: {
                    nama: string;
                    kategori: string;
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
        })[];
    }>;
    getStock(): Promise<{
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
        }[];
        mutasi: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.MutasiStokGroupByOutputType, ("barangId" | "tipe")[]> & {
            _sum: {
                jumlah: number | null;
            };
        })[];
    }>;
}

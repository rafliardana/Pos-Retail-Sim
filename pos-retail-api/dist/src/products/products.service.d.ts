import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    findOne(id: number): Promise<{
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
    }>;
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__BarangClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
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
    }>;
    getLowStock(): import(".prisma/client").Prisma.PrismaPromise<unknown>;
}

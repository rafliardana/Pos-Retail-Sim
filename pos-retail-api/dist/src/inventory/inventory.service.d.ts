import { PrismaService } from '../prisma/prisma.service';
import { CreateMutationDto } from './dto/mutation.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    createMutation(dto: CreateMutationDto, userId: number): Promise<{
        barang: {
            nama: string;
        };
    } & {
        id: number;
        createdAt: Date;
        barangId: number;
        tipe: import(".prisma/client").$Enums.TipeMutasi;
        jumlah: number;
        keterangan: string | null;
        penggunaId: number;
    }>;
    getMutations(barangId?: number): import(".prisma/client").Prisma.PrismaPromise<({
        pengguna: {
            nama: string;
        };
        barang: {
            nama: string;
        };
    } & {
        id: number;
        createdAt: Date;
        barangId: number;
        tipe: import(".prisma/client").$Enums.TipeMutasi;
        jumlah: number;
        keterangan: string | null;
        penggunaId: number;
    })[]>;
    getLowStock(): import(".prisma/client").Prisma.PrismaPromise<unknown>;
}

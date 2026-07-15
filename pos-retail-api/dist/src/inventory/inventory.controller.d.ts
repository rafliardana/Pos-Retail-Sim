import { CreateMutationDto } from './dto/mutation.dto';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    createMutation(dto: CreateMutationDto, req: any): Promise<{
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
    getMutations(barangId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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

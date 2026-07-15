import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        password: string;
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
        createdAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        password: string;
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
        createdAt: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        password: string;
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
        createdAt: Date;
    }>;
    update(id: number, dto: UpdateUserDto): Promise<{
        password: string;
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
        createdAt: Date;
    }>;
    remove(id: number): Promise<{
        password: string;
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
        createdAt: Date;
    }>;
}

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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

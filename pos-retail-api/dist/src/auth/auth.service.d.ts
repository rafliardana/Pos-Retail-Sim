import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            nama: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    getMe(userId: number): Promise<{
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
    } | null>;
}

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            nama: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    getMe(req: any): Promise<{
        id: number;
        username: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.StatusUser;
    } | null>;
}

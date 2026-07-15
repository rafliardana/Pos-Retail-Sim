export declare class CreateUserDto {
    username: string;
    password: string;
    nama: string;
    role: 'kasir' | 'gudang' | 'admin' | 'owner';
}
export declare class UpdateUserDto {
    nama?: string;
    password?: string;
    role?: string;
    status?: string;
}

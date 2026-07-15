import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'andi' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Andi Kasir' })
  @IsString()
  nama: string;

  @ApiProperty({ enum: ['kasir', 'gudang', 'admin', 'owner'] })
  @IsEnum(['kasir', 'gudang', 'admin', 'owner'])
  role: 'kasir' | 'gudang' | 'admin' | 'owner';
}

export class UpdateUserDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nama?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(6) password?: string;
  @ApiPropertyOptional({ enum: ['kasir', 'gudang', 'admin', 'owner'] })
  @IsOptional() @IsEnum(['kasir', 'gudang', 'admin', 'owner']) role?: string;
  @ApiPropertyOptional({ enum: ['aktif', 'nonaktif'] })
  @IsOptional() @IsEnum(['aktif', 'nonaktif']) status?: string;
}

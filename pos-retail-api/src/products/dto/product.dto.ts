import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Indomie Goreng' })
  @IsString()
  nama: string;

  @ApiProperty({ example: 3500 })
  @IsInt()
  @Min(0)
  harga: number;

  @ApiProperty({ example: 150 })
  @IsInt()
  @Min(0)
  stok: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  minStok: number;

  @ApiProperty({ example: 'Makanan' })
  @IsString()
  kategori: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gambar?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() nama?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) harga?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) stok?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) minStok?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() kategori?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() barcode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gambar?: string;
}

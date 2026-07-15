import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMutationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  barangId: number;

  @ApiProperty({ enum: ['masuk', 'keluar'] })
  @IsEnum(['masuk', 'keluar'])
  tipe: 'masuk' | 'keluar';

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(1)
  jumlah: number;

  @ApiPropertyOptional({ example: 'Penerimaan dari supplier' })
  @IsOptional()
  @IsString()
  keterangan?: string;
}

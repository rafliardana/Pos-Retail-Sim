import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class TransactionItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  barangId: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  jumlah: number;
}

export class CreateTransactionDto {
  @ApiProperty({ type: [TransactionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];
}

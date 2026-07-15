import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'devi' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @MinLength(6)
  password: string;
}

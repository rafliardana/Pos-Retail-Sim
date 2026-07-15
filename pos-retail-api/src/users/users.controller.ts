import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar semua pengguna (Admin)' })
  findAll() { return this.usersService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Detail pengguna (Admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.usersService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Tambah pengguna baru (Admin)' })
  create(@Body() dto: CreateUserDto) { return this.usersService.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit pengguna (Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus pengguna (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.usersService.remove(id); }
}

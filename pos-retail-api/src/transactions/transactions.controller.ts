import {
  Body, Controller, Get, Param, ParseIntPipe,
  Patch, Post, Request, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { CreateTransactionDto } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('kasir')
  @ApiOperation({ summary: 'Buat transaksi POS baru (Kasir)' })
  create(@Body() dto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(dto, req.user.id);
  }

  @Get()
  @Roles('admin', 'owner', 'kasir')
  @ApiOperation({ summary: 'Riwayat transaksi (Admin/Owner/Kasir)' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail transaksi' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id/verify')
  @Roles('admin')
  @ApiOperation({ summary: 'Verifikasi transaksi (Admin)' })
  verify(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.verify(id);
  }
}

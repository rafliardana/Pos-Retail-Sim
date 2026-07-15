import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('owner', 'admin')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @ApiOperation({ summary: 'Laporan penjualan (Owner/Admin)' })
  @ApiQuery({ name: 'from', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'to', required: false, example: '2025-12-31' })
  getSales(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getSalesReport(from, to);
  }

  @Get('stock')
  @ApiOperation({ summary: 'Laporan stok dan mutasi (Owner/Admin)' })
  getStock() {
    return this.reportsService.getStockReport();
  }
}

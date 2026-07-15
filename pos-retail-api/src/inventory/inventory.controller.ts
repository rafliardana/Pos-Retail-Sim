import {
  Body, Controller, Get, Post, Query, Request, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { CreateMutationDto } from './dto/mutation.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('mutation')
  @Roles('gudang')
  @ApiOperation({ summary: 'Input barang masuk/keluar (Gudang)' })
  createMutation(@Body() dto: CreateMutationDto, @Request() req) {
    return this.inventoryService.createMutation(dto, req.user.id);
  }

  @Get('mutation')
  @Roles('gudang', 'admin', 'owner')
  @ApiQuery({ name: 'barangId', required: false, type: Number })
  @ApiOperation({ summary: 'Riwayat mutasi stok' })
  getMutations(@Query('barangId') barangId?: string) {
    return this.inventoryService.getMutations(barangId ? +barangId : undefined);
  }

  @Get('low-stock')
  @Roles('gudang', 'admin', 'owner')
  @ApiOperation({ summary: 'Produk stok kritis (di bawah minimum)' })
  getLowStock() {
    return this.inventoryService.getLowStock();
  }
}

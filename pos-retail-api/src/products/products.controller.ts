import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar semua produk' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @Get('low-stock')
  @Roles('gudang', 'admin', 'owner')
  @ApiOperation({ summary: 'Produk dengan stok di bawah minimum' })
  getLowStock() {
    return this.productsService.getLowStock();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail satu produk' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('gudang', 'admin')
  @ApiOperation({ summary: 'Tambah produk baru (Gudang/Admin)' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Roles('gudang', 'admin')
  @ApiOperation({ summary: 'Edit produk (Gudang/Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('gudang', 'admin')
  @ApiOperation({ summary: 'Hapus produk (Gudang/Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../auth/guards");
const mutation_dto_1 = require("./dto/mutation.dto");
const inventory_service_1 = require("./inventory.service");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    createMutation(dto, req) {
        return this.inventoryService.createMutation(dto, req.user.id);
    }
    getMutations(barangId) {
        return this.inventoryService.getMutations(barangId ? +barangId : undefined);
    }
    getLowStock() {
        return this.inventoryService.getLowStock();
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('mutation'),
    (0, guards_1.Roles)('gudang'),
    (0, swagger_1.ApiOperation)({ summary: 'Input barang masuk/keluar (Gudang)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mutation_dto_1.CreateMutationDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createMutation", null);
__decorate([
    (0, common_1.Get)('mutation'),
    (0, guards_1.Roles)('gudang', 'admin', 'owner'),
    (0, swagger_1.ApiQuery)({ name: 'barangId', required: false, type: Number }),
    (0, swagger_1.ApiOperation)({ summary: 'Riwayat mutasi stok' }),
    __param(0, (0, common_1.Query)('barangId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMutations", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, guards_1.Roles)('gudang', 'admin', 'owner'),
    (0, swagger_1.ApiOperation)({ summary: 'Produk stok kritis (di bawah minimum)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLowStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map
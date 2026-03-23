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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = exports.CreateApiKeyDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class CreateApiKeyDto {
    key;
    userId;
}
exports.CreateApiKeyDto = CreateApiKeyDto;
let ApiKeyService = class ApiKeyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createApiKeyDto) {
        return this.prisma.apiKey.create({
            data: {
                key: createApiKeyDto.key,
                userId: createApiKeyDto.userId,
            },
        });
    }
    async findAll() {
        return this.prisma.apiKey.findMany({
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    findByUser(userId) {
        return this.prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    remove(id) {
        return this.prisma.apiKey.delete({ where: { id } });
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map
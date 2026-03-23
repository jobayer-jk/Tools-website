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
exports.HistoryService = exports.CreateHistoryDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
class CreateHistoryDto {
    toolName;
    action;
    userId;
}
exports.CreateHistoryDto = CreateHistoryDto;
let HistoryService = class HistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createHistoryDto) {
        return this.prisma.history.create({
            data: {
                toolName: createHistoryDto.toolName,
                action: createHistoryDto.action,
                userId: createHistoryDto.userId,
            },
        });
    }
    findByUser(userId) {
        return this.prisma.history.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    remove(id) {
        return this.prisma.history.delete({ where: { id } });
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HistoryService);
//# sourceMappingURL=history.service.js.map
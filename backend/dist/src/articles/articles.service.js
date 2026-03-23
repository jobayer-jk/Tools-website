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
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticlesService = class ArticlesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { title, slug, category, content, coverImage, status, publishedAt, authorId } = createDto;
        return this.prisma.article.create({
            data: {
                title,
                slug,
                category,
                content,
                coverImage,
                status: status || 'DRAFT',
                publishedAt: publishedAt ? new Date(publishedAt) : null,
                author: { connect: { id: authorId } },
            },
        });
    }
    async findAllPublic(category) {
        return this.prisma.article.findMany({
            where: {
                status: 'PUBLISHED',
                ...(category && { category }),
                publishedAt: { lte: new Date() },
            },
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                coverImage: true,
                publishedAt: true,
                author: { select: { email: true } }
            }
        });
    }
    async findAllDashboard() {
        return this.prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { email: true } } }
        });
    }
    async findOnePublic(slug) {
        const article = await this.prisma.article.findUnique({
            where: { slug },
            include: { author: { select: { email: true } } }
        });
        if (!article || article.status !== 'PUBLISHED') {
            throw new common_1.NotFoundException(`Valid published article with slug ${slug} not found`);
        }
        return article;
    }
    async update(id, updateDto) {
        return this.prisma.article.update({
            where: { id },
            data: updateDto,
        });
    }
    async remove(id) {
        return this.prisma.article.delete({
            where: { id },
        });
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map
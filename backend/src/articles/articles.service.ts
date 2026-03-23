import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: any) {
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

  async findAllPublic(category?: string) {
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

  async findOnePublic(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: { author: { select: { email: true } } }
    });
    
    if (!article || article.status !== 'PUBLISHED') {
      throw new NotFoundException(`Valid published article with slug ${slug} not found`);
    }
    
    return article;
  }

  async update(id: string, updateDto: any) {
    return this.prisma.article.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateApiKeyDto {
  key!: string;
  userId!: string;
}

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  create(createApiKeyDto: CreateApiKeyDto) {
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

  findByUser(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string) {
    return this.prisma.apiKey.delete({ where: { id } });
  }
}

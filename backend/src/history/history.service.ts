import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateHistoryDto {
  toolName!: string;
  action!: string;
  userId!: string;
}

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  create(createHistoryDto: CreateHistoryDto) {
    return this.prisma.history.create({
      data: {
        toolName: createHistoryDto.toolName,
        action: createHistoryDto.action,
        userId: createHistoryDto.userId,
      },
    });
  }

  findByUser(userId: string) {
    return this.prisma.history.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string) {
    return this.prisma.history.delete({ where: { id } });
  }
}

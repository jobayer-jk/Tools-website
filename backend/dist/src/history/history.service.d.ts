import { PrismaService } from '../prisma/prisma.service';
export declare class CreateHistoryDto {
    toolName: string;
    action: string;
    userId: string;
}
export declare class HistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createHistoryDto: CreateHistoryDto): import(".prisma/client").Prisma.Prisma__HistoryClient<{
        id: string;
        createdAt: Date;
        toolName: string;
        action: string;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        toolName: string;
        action: string;
        userId: string;
    }[]>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__HistoryClient<{
        id: string;
        createdAt: Date;
        toolName: string;
        action: string;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}

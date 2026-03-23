import { HistoryService, CreateHistoryDto } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
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

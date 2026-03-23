import { PrismaService } from '../prisma/prisma.service';
export declare class CreateApiKeyDto {
    key: string;
    userId: string;
}
export declare class ApiKeyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createApiKeyDto: CreateApiKeyDto): import(".prisma/client").Prisma.Prisma__ApiKeyClient<{
        id: string;
        createdAt: Date;
        userId: string;
        key: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): Promise<({
        user: {
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        key: string;
    })[]>;
    findByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        key: string;
    }[]>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ApiKeyClient<{
        id: string;
        createdAt: Date;
        userId: string;
        key: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}

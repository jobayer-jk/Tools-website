import { PrismaService } from '../prisma/prisma.service';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    findAllPublic(category?: string): Promise<{
        id: string;
        title: string;
        slug: string;
        category: string;
        coverImage: string | null;
        publishedAt: Date | null;
        author: {
            email: string;
        };
    }[]>;
    findAllDashboard(): Promise<({
        author: {
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        authorId: string;
    })[]>;
    findOnePublic(slug: string): Promise<{
        author: {
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    update(id: string, updateDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        category: string;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
}

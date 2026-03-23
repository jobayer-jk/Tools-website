import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        siteName: string;
        siteLogoUrl: string | null;
        siteFaviconUrl: string | null;
    } | {
        siteName: string;
        siteLogoUrl: null;
    }>;
    updateSettings(updateDto: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        siteName: string;
        siteLogoUrl: string | null;
        siteFaviconUrl: string | null;
    }>;
}

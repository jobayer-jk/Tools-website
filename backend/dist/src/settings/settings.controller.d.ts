import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<{
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
    getAdminSettings(): Promise<{
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

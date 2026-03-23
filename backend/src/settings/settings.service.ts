import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.siteSettings.findUnique({
      where: { id: 1 },
    });
    if (!settings) {
      return { siteName: "Web Tools Hub", siteLogoUrl: null };
    }
    return settings;
  }

  async updateSettings(updateDto: any) {
    return this.prisma.siteSettings.upsert({
      where: { id: 1 },
      update: updateDto,
      create: { ...updateDto, id: 1 },
    });
  }
}

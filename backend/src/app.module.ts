import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { ArticlesModule } from './articles/articles.module';
import { SettingsModule } from './settings/settings.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, HistoryModule, ApiKeyModule, ArticlesModule, SettingsModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

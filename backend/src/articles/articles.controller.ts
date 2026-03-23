import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: any) {
    return this.articlesService.create(createDto);
  }

  @Get()
  findAllPublic(@Query('category') category?: string) {
    return this.articlesService.findAllPublic(category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  findAllDashboard() {
    return this.articlesService.findAllDashboard();
  }

  @Get(':slug')
  findOnePublic(@Param('slug') slug: string) {
    return this.articlesService.findOnePublic(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.articlesService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}

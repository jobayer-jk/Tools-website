import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoryService, CreateHistoryDto } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.historyService.findByUser(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(id);
  }
}

import { Module } from '@nestjs/common';
import { InternaController } from './interna.controller';
import { InternaService } from './interna.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [InternaController],
  providers: [InternaService, PrismaService],
})
export class InternaModule {}

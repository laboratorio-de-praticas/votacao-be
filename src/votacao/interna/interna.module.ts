import { Module } from '@nestjs/common';
import { InternaController } from './interna.controller';
import { InternaService } from './interna.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthGuard } from './auth/interna.auth';

@Module({
  controllers: [InternaController],
  providers: [InternaService, PrismaService, AuthGuard],
})
export class InternaModule {}

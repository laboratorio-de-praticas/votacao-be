import { Module } from '@nestjs/common';
import { PublicaController } from './publica.controller';
import { PublicaService } from './publica.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PublicaController],
  providers: [PublicaService, PrismaService],
})
export class PublicaModule {}

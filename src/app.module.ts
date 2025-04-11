import { Module } from '@nestjs/common';
import { VotacaoModule } from './votacao/votacao.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [VotacaoModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { VotacaoModule } from './votacao/votacao.module'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [VotacaoModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

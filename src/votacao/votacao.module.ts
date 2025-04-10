import { Module } from '@nestjs/common';
import { InternaModule } from './interna/interna.module';
//import { PublicaModule } from './publica/publica.module';

@Module({
  imports: [InternaModule /*, PublicaModule */ ],

})
export class VotacaoModule {}

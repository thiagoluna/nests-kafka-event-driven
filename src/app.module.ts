import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SlipsModule } from './slips/slips.module';

@Module({
  imports: [SlipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

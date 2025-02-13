import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { XRAY_DATA_EXCHANGE } from './common/constant';
import { config } from './common/config';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: XRAY_DATA_EXCHANGE,
          type: 'direct',
        },
      ],
      uri: config.rmq.url,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

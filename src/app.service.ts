import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { XRAY_DATA_EXCHANGE } from './common/constant';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomInt, randomUUID } from 'crypto';
import { Types } from 'mongoose';

@Injectable()
export class AppService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  generateRandomData(): Record<string, any> {
    const deviceId = this.generateDeviceId();
    const data = this.generateDataArray();
    const timestamp = Date.now();

    return {
      [deviceId]: {
        data,
        time: timestamp,
      },
    };
  }

  private generateDeviceId(): string {
    return new Types.ObjectId().toString();
  }

  private generateDataArray(): [number, [number, number, number]][] {
    const data: [number, [number, number, number]][] = [];
    let currentTime = 0;

    for (let i = 0; i < this.randomInt(2, 10); i++) {
      currentTime += this.randomInt(500, 1500);

      data.push([
        currentTime,
        [
          this.randomFloat(51.33, 51.35),
          this.randomFloat(12.33, 12.35),
          this.randomFloat(1, 3),
        ],
      ]);
    }

    return data;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFloat(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(6));
  }

  @Cron(CronExpression.EVERY_10_SECONDS) 
  async produce() {
     
 
    await this.amqpConnection.publish(XRAY_DATA_EXCHANGE, 'xray-data', this.generateRandomData());
  }
}
